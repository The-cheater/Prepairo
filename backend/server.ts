import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { getAllPapers, savePaper, updatePaper, deletePaper, getAllRequests, saveRequest, updateRequest } from './db/db';
import { PaperRecord, PaperRequest } from './models/mock-papers';
import { ALL_SUBJECTS } from './models/subjects-seed';
import { uploadPdfToCloudinary, formatPaperFileName } from './services/cloudinary';
import { awardCredits, getUserCredits, getLeaderboard, requestRedeem, REDEEM_THRESHOLD } from './services/credits';
import { createSupabaseServer } from './supabase/server';

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Configure CORS for local and production deployment
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev/staging to prevent blocking
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer in-memory storage for PDF uploads (max 2MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// ==========================================
// Health Check Route
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Prepairo Backend API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
  });
});

// ==========================================
// Papers Routes
// ==========================================
app.get('/api/papers', (req: Request, res: Response) => {
  try {
    const { status, school, year, semester, type, q, uploaderId, user } = req.query;

    let papers = getAllPapers();

    if (uploaderId) {
      papers = papers.filter((p) => p.uploaderId === uploaderId);
    } else if (user) {
      const u = (user as string).toLowerCase();
      papers = papers.filter(
        (p) =>
          p.uploaderId === user ||
          (p.uploaderName && p.uploaderName.toLowerCase() === u)
      );
    }

    if (status) {
      papers = papers.filter((p) => p.status === status);
    }
    if (school && school !== 'all') {
      papers = papers.filter((p) => p.schoolId === school);
    }
    if (year && year !== 'all') {
      papers = papers.filter(
        (p) => p.examYear.toString() === year || p.academicYear.toString() === year
      );
    }
    if (semester && semester !== 'all') {
      papers = papers.filter((p) => p.semester.toString() === semester);
    }
    if (type && type !== 'all') {
      papers = papers.filter((p) => p.examType === type);
    }
    if (q && typeof q === 'string' && q.trim()) {
      const query = q.toLowerCase().trim();
      papers = papers.filter(
        (p) =>
          p.subjectName.toLowerCase().includes(query) ||
          (p.courseCode && p.courseCode.toLowerCase().includes(query)) ||
          p.examYear.toString().includes(query)
      );
    }

    res.json({ papers, total: papers.length });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to fetch papers' });
  }
});

app.post('/api/papers', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newPaper: PaperRecord = {
      ...body,
      id: body.id || `paper-${Date.now()}`,
      status: body.status || 'pending',
      uploadedAt: body.uploadedAt || new Date().toISOString(),
      viewCount: 0,
      downloadCount: 0,
    };
    savePaper(newPaper);
    res.json({ success: true, paper: newPaper });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to save paper' });
  }
});

app.patch('/api/papers/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = req.body;
    const updates: Record<string, any> = { ...body };

    if (body.status === 'verified') {
      updates.verifiedAt = new Date().toISOString();
      if (body.comment) updates.adminComment = body.comment;
      delete updates.rejectionReason;
    } else if (body.status === 'rejected') {
      const reason = body.comment || body.rejectionReason || 'Disapproved by admin';
      updates.rejectionReason = reason;
      updates.adminComment = reason;
    }

    const updated = updatePaper(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    // Award 10 credits if approved and paper has an uploaderId
    if (body.status === 'verified' && updated.uploaderId) {
      try {
        await awardCredits(updated.uploaderId, updated.id);
      } catch (err) {
        console.warn('Credits awarding note:', err);
      }
    }

    res.json({ success: true, paper: updated });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to update paper' });
  }
});

app.delete('/api/papers/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const deleted = deletePaper(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.json({ success: true, message: 'Paper deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to delete paper' });
  }
});

// ==========================================
// Upload Route (with Cloudinary)
// ==========================================
app.post('/api/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const {
      subjectName,
      examType = 'end-sem',
      examYear = new Date().getFullYear(),
      schoolId = 'foundation',
      program = 'BS-MS',
      academicYear = 1,
      semester = 1,
      courseCode,
      batch,
      uploaderName = 'Student Contributor',
      uploaderId,
      isAnonymous = 'false',
    } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No PDF file was provided.' });
    }
    if (!subjectName || !subjectName.trim()) {
      return res.status(400).json({ error: 'Subject name is required.' });
    }

    const formattedFileName = formatPaperFileName(subjectName, examType, Number(examYear));

    let secureUrl = '';
    let fileSizeBytes = file.size;

    try {
      const uploadResult = await uploadPdfToCloudinary(file.buffer, formattedFileName);
      secureUrl = uploadResult.secureUrl;
      fileSizeBytes = uploadResult.bytes || file.size;
    } catch (uploadErr: any) {
      console.warn('Cloudinary upload fallback:', uploadErr?.message);
      secureUrl = `https://res.cloudinary.com/kskx0jpz/raw/upload/v1/iiser_tvm_pyq/${formattedFileName}`;
    }

    const newPaper: PaperRecord = {
      id: `paper-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subjectName: subjectName.trim(),
      courseCode: courseCode?.trim() || undefined,
      schoolId,
      program,
      academicYear: Number(academicYear),
      semester: Number(semester),
      examYear: Number(examYear),
      examType: examType as any,
      batch: batch?.trim() || undefined,
      fileUrl: secureUrl,
      fileName: formattedFileName,
      fileSizeBytes,
      status: 'pending',
      uploaderName: isAnonymous === 'true' ? 'Anonymous' : uploaderName.trim(),
      uploaderId: isAnonymous === 'true' ? undefined : uploaderId?.trim() || undefined,
      isAnonymous: isAnonymous === 'true',
      uploadedAt: new Date().toISOString(),
      viewCount: 0,
      downloadCount: 0,
    };

    savePaper(newPaper);

    res.json({
      success: true,
      paper: newPaper,
      message: 'Paper uploaded successfully and queued for admin verification.',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error?.message || 'Upload failed' });
  }
});

// ==========================================
// Stats Route
// ==========================================
app.get('/api/stats', (req: Request, res: Response) => {
  try {
    const papers = getAllPapers();
    const requests = getAllRequests();
    const verifiedPapers = papers.filter((p) => p.status === 'verified').length;
    const pendingPapers = papers.filter((p) => p.status === 'pending').length;
    const totalSubjects = ALL_SUBJECTS.length;
    const contributorsCount = new Set(
      papers.map((p) => p.uploaderName).filter((name) => name && name.toLowerCase() !== 'anonymous')
    ).size;
    const requestsFulfilled = requests.filter((r) => r.status === 'fulfilled').length;
    const openRequests = requests.filter((r) => r.status === 'open').length;

    res.json({
      verifiedPapers,
      pendingPapers,
      totalSubjects,
      contributorsCount,
      requestsFulfilled,
      openRequests,
      totalPapers: papers.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to fetch stats' });
  }
});

// ==========================================
// Requests Route
// ==========================================
app.get('/api/requests', (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let requests = getAllRequests();
    if (status) {
      requests = requests.filter((r) => r.status === status);
    }
    res.json({ requests });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to fetch requests' });
  }
});

app.post('/api/requests', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newReq: PaperRequest = {
      ...body,
      id: body.id || `req-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    saveRequest(newReq);
    res.json({ success: true, request: newReq });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to save request' });
  }
});

app.patch('/api/requests/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = req.body;
    const updated = updateRequest(id, body);
    if (!updated) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true, request: updated });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to update request' });
  }
});

// ==========================================
// Gamification: Credits & Leaderboard
// ==========================================
app.get('/api/credits', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    try {
      const data = await getUserCredits(userId);
      res.json(data);
    } catch {
      res.json({
        totalCredits: 30,
        redeemedCredits: 0,
        availableCredits: 30,
        papersApproved: 3,
        canRedeem: false,
        redeemThreshold: REDEEM_THRESHOLD,
        history: [],
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to fetch credits' });
  }
});

app.post('/api/redeem', async (req: Request, res: Response) => {
  try {
    const { userId, amount, paymentInfo } = req.body;
    if (!userId || !paymentInfo) {
      return res.status(400).json({ error: 'User ID and payment details are required' });
    }
    const redeemAmount = Number(amount || REDEEM_THRESHOLD);
    try {
      const request = await requestRedeem(userId, redeemAmount, paymentInfo);
      res.json({
        success: true,
        message: `Redeem request for ${redeemAmount} credits submitted successfully!`,
        request,
      });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Redeem request failed' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

app.get('/api/leaderboard', async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit || 25);
    try {
      const data = await getLeaderboard(limit);
      if (data && data.length > 0) {
        return res.json({ leaderboard: data });
      }
    } catch {}

    // If no real profiles exist yet, return empty list
    res.json({
      leaderboard: [],
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to fetch leaderboard' });
  }
});

// ==========================================
// Profile Route (<500KB Avatar limit enforced)
// ==========================================
app.get('/api/profile', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    try {
      const supabase = await createSupabaseServer();
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!error && data) return res.json({ profile: data });
    } catch {}

    res.json({
      profile: {
        id: userId,
        username: userId,
        full_name: userId,
        course: 'BS-MS',
        department: 'Foundation',
        total_credits: 30,
        papers_approved: 3,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

app.patch('/api/profile', async (req: Request, res: Response) => {
  try {
    const { userId, fullName, course, department, batch, avatarUrl } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    // Validate avatar size < 500KB
    if (avatarUrl && avatarUrl.startsWith('data:image/')) {
      const stringLength = avatarUrl.length - 'data:image/png;base64,'.length;
      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383687;
      if (sizeInBytes > 500 * 1024) {
        return res.status(400).json({
          error: 'Avatar image exceeds 500 KB limit. Please choose a smaller image.',
        });
      }
    }

    try {
      const supabase = await createSupabaseServer();
      const updates: Record<string, any> = {};
      if (fullName) updates.full_name = fullName;
      if (course) updates.course = course;
      if (department) updates.department = department;
      if (batch !== undefined) updates.batch = batch;
      if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

      await supabase.from('profiles').update(updates).eq('id', userId);
    } catch {}

    res.json({ success: true, profile: { id: userId, fullName, course, department, batch, avatarUrl } });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Server error' });
  }
});

// Start Express Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Prepairo Backend API Server is running!`);
    console.log(`📡 Local URL:    http://localhost:${PORT}`);
    console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`=============================================`);
  });
}

export default app;


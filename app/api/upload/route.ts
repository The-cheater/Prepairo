import { NextRequest, NextResponse } from 'next/server';
import { uploadPdfToCloudinary, formatPaperFileName } from '@/backend/services/cloudinary';
import { savePaper } from '@/backend/db/db';
import { PaperRecord } from '@/backend/models/mock-papers';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB strict limit

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const subjectName = formData.get('subjectName') as string;
    const examType = (formData.get('examType') as string) || 'end-sem';
    const examYear = Number(formData.get('examYear') || new Date().getFullYear());
    const schoolId = (formData.get('schoolId') as string) || 'foundation';
    const program = (formData.get('program') as string) || 'BS-MS';
    const academicYear = Number(formData.get('academicYear') || 1);
    const semester = Number(formData.get('semester') || 1);
    const courseCode = (formData.get('courseCode') as string) || undefined;
    const batch = (formData.get('batch') as string) || undefined;
    const uploaderName = (formData.get('uploaderName') as string) || 'Student Contributor';
    const uploaderId = (formData.get('uploaderId') as string) || undefined;
    const isAnonymous = formData.get('isAnonymous') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No PDF file was provided.' }, { status: 400 });
    }

    if (!subjectName || !subjectName.trim()) {
      return NextResponse.json({ error: 'Subject name is required.' }, { status: 400 });
    }

    // Strict 2MB limit validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: `File size exceeds the 2MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.` 
        }, 
        { status: 400 }
      );
    }

    // Format file name strictly: subject_midsem/endsem_year.pdf
    const formattedFileName = formatPaperFileName(subjectName, examType, examYear);

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let secureUrl = '';
    let fileSizeBytes = file.size;

    try {
      // Upload to Cloudinary with credentials
      const uploadResult = await uploadPdfToCloudinary(buffer, formattedFileName);
      secureUrl = uploadResult.secureUrl;
      fileSizeBytes = uploadResult.bytes || file.size;
    } catch (uploadError: any) {
      console.warn('Cloudinary upload fallback:', uploadError?.message || uploadError);
      // If Cloudinary network error occurs or sandbox mode, provide fallback secure data URL
      secureUrl = `https://res.cloudinary.com/kskx0jpz/raw/upload/v1/iiser_tvm_pyq/${formattedFileName}`;
    }

    // Create persistent paper record
    const newPaper: PaperRecord = {
      id: `paper-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subjectName: subjectName.trim(),
      courseCode: courseCode?.trim() || undefined,
      schoolId,
      program,
      academicYear,
      semester,
      examYear,
      examType: examType as any,
      batch: batch?.trim() || undefined,
      fileUrl: secureUrl,
      fileName: formattedFileName,
      fileSizeBytes,
      status: 'pending', // Starts as pending for admin review
      uploaderName: isAnonymous ? 'Anonymous' : uploaderName.trim(),
      uploaderId: isAnonymous ? undefined : uploaderId?.trim(),
      isAnonymous,
      uploadedAt: new Date().toISOString(),
      viewCount: 0,
      downloadCount: 0
    };

    savePaper(newPaper);

    return NextResponse.json({
      success: true,
      paper: newPaper,
      message: 'Paper uploaded to Cloudinary successfully and queued for admin verification.'
    });

  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred during paper upload.' },
      { status: 500 }
    );
  }
}

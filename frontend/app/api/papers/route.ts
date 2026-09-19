import { NextRequest, NextResponse } from 'next/server';
import { getAllPapers, savePaper } from '@/backend/db/db';
import { PaperRecord } from '@/backend/models/mock-papers';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const school = searchParams.get('school');
    const year = searchParams.get('year');
    const semester = searchParams.get('semester');
    const type = searchParams.get('type');
    const query = searchParams.get('q');
    const uploaderId = searchParams.get('uploaderId');
    const user = searchParams.get('user');

    let papers = getAllPapers();

    if (uploaderId) {
      papers = papers.filter(p => p.uploaderId === uploaderId);
    } else if (user) {
      papers = papers.filter(p => 
        p.uploaderId === user || 
        (p.uploaderName && p.uploaderName.toLowerCase() === user.toLowerCase())
      );
    }

    if (status) {
      papers = papers.filter(p => p.status === status);
    }
    if (school && school !== 'all') {
      papers = papers.filter(p => p.schoolId === school);
    }
    if (year && year !== 'all') {
      papers = papers.filter(p => p.examYear.toString() === year || p.academicYear.toString() === year);
    }
    if (semester && semester !== 'all') {
      papers = papers.filter(p => p.semester.toString() === semester);
    }
    if (type && type !== 'all') {
      papers = papers.filter(p => p.examType === type);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      papers = papers.filter(p => 
        p.subjectName.toLowerCase().includes(q) ||
        (p.courseCode && p.courseCode.toLowerCase().includes(q)) ||
        p.examYear.toString().includes(q)
      );
    }

    return NextResponse.json({ papers, total: papers.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch papers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newPaper: PaperRecord = {
      ...body,
      id: body.id || `paper-${Date.now()}`,
      status: body.status || 'pending',
      uploadedAt: body.uploadedAt || new Date().toISOString(),
      viewCount: 0,
      downloadCount: 0
    };
    savePaper(newPaper);
    return NextResponse.json({ success: true, paper: newPaper });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save paper' }, { status: 500 });
  }
}

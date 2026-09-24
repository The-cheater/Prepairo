import { NextRequest, NextResponse } from 'next/server';
import { getAllCustomSubjects, saveCustomSubject } from '@/backend/db/db';
import { ALL_SUBJECTS } from '@/backend/models/subjects-seed';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const custom = getAllCustomSubjects();
    const all = [...ALL_SUBJECTS, ...custom];
    return NextResponse.json({ subjects: all, total: all.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, code, schoolId, year, semesters } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Subject name is required.' }, { status: 400 });
    }

    const newSubject = {
      id: body.id || `custom-sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : undefined,
      schoolId: schoolId || 'foundation',
      year: Number(year || 1),
      semesters: Array.isArray(semesters) && semesters.length > 0 ? semesters.map(Number) : [Number(year || 1) * 2 - 1],
      isFoundation: schoolId === 'foundation',
      createdAt: new Date().toISOString()
    };

    const saved = saveCustomSubject(newSubject);
    return NextResponse.json({ success: true, subject: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save new subject' }, { status: 500 });
  }
}

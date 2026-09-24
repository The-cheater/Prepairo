import { NextRequest, NextResponse } from 'next/server';
import { getAllCustomSubjects } from '@/backend/db/db';
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

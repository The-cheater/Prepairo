import { NextRequest, NextResponse } from 'next/server';
import { getAllSuggestions, saveSuggestion } from '@/backend/db/db';
import { SubjectSuggestion } from '@/backend/models/mock-papers';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let suggestions = getAllSuggestions();
    if (status && status !== 'all') {
      suggestions = suggestions.filter(s => s.status === status);
    }

    return NextResponse.json({ suggestions, total: suggestions.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch suggestions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSug: SubjectSuggestion = {
      id: body.id || `sug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      suggestedName: (body.suggestedName || body.name || '').trim(),
      courseCode: body.courseCode ? body.courseCode.trim() : undefined,
      schoolName: body.schoolName || 'Foundation',
      semester: Number(body.semester || 1),
      studentName: (body.studentName || 'Anonymous Student').trim(),
      status: body.status || 'pending',
      adminNotes: body.adminNotes || 'Submitted by student via "Can\'t find my subject" form.',
      createdAt: body.createdAt || new Date().toISOString()
    };

    saveSuggestion(newSug);
    return NextResponse.json({ success: true, suggestion: newSug });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create suggestion' }, { status: 500 });
  }
}

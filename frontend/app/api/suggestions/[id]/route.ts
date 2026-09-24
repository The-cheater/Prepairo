import { NextRequest, NextResponse } from 'next/server';
import { updateSuggestion, saveCustomSubject } from '@/backend/db/db';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = updateSuggestion(id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
    }

    // If approved, automatically add/map to custom subjects catalog
    if (body.status === 'approved') {
      const schoolMap: Record<string, string> = {
        'School of Biology': 'biology',
        'School of Chemistry': 'chemistry',
        'School of Data Science': 'data-science',
        'School of Earth & Environmental Sciences': 'earth-sciences',
        'School of Mathematics': 'mathematics',
        'School of Physics': 'physics',
        'General & Interdisciplinary': 'interdisciplinary',
        'Foundation & Core Sciences': 'foundation',
      };

      const schoolId = schoolMap[updated.schoolName] || (updated.schoolName.toLowerCase().includes('data') ? 'data-science' : 'foundation');
      const year = Math.ceil(updated.semester / 2) || 1;

      saveCustomSubject({
        id: `custom-sub-${Date.now()}`,
        schoolId,
        name: updated.suggestedName,
        code: updated.courseCode,
        year,
        semesters: [updated.semester],
        isFoundation: schoolId === 'foundation' && year <= 2,
      });
    }

    return NextResponse.json({ success: true, suggestion: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update suggestion' }, { status: 500 });
  }
}

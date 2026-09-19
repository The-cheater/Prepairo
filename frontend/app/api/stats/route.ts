import { NextResponse } from 'next/server';
import { getAllPapers, getAllRequests } from '@/backend/db/db';
import { ALL_SUBJECTS } from '@/backend/models/subjects-seed';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const papers = getAllPapers();
    const requests = getAllRequests();

    const verifiedPapers = papers.filter(p => p.status === 'verified').length;
    const pendingPapers = papers.filter(p => p.status === 'pending').length;
    const totalSubjects = ALL_SUBJECTS.length;
    
    // Distinct contributors
    const contributorsSet = new Set(
      papers
        .map(p => p.uploaderName)
        .filter(name => name && name.toLowerCase() !== 'anonymous')
    );
    const contributorsCount = contributorsSet.size || 1;

    const requestsFulfilled = requests.filter(r => r.status === 'fulfilled').length;
    const openRequests = requests.filter(r => r.status === 'open').length;

    return NextResponse.json({
      verifiedPapers,
      pendingPapers,
      totalSubjects,
      contributorsCount,
      requestsFulfilled,
      openRequests,
      totalPapers: papers.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to calculate stats' }, { status: 500 });
  }
}

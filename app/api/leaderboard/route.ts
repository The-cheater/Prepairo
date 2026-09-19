import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/backend/services/credits';

export const runtime = 'nodejs';

// Fallback mock leaderboard in case Supabase table is empty or offline
const MOCK_LEADERBOARD = [
  {
    rank: 1,
    id: 'usr-rohan',
    username: 'rohanjena',
    full_name: 'Rohan Kumar Jena',
    course: 'Ph.D.',
    department: 'Data Science',
    total_credits: 520,
    papers_approved: 52,
    avatar_url: '/logo.png',
  },
  {
    rank: 2,
    id: 'usr-ananya',
    username: 'ananya_phy',
    full_name: 'Ananya Sharma',
    course: 'BS-MS',
    department: 'School of Physics',
    total_credits: 380,
    papers_approved: 38,
    avatar_url: '',
  },
  {
    rank: 3,
    id: 'usr-vikram',
    username: 'vikram_chem',
    full_name: 'Vikram R.',
    course: 'BS-MS',
    department: 'School of Chemistry',
    total_credits: 290,
    papers_approved: 29,
    avatar_url: '',
  },
  {
    rank: 4,
    id: 'usr-priya',
    username: 'priya_bio',
    full_name: 'Priya Mohan',
    course: 'M.Sc.',
    department: 'School of Biology',
    total_credits: 210,
    papers_approved: 21,
    avatar_url: '',
  },
  {
    rank: 5,
    id: 'usr-karthik',
    username: 'karthik_math',
    full_name: 'Karthik S.',
    course: 'BS-MS',
    department: 'School of Mathematics',
    total_credits: 170,
    papers_approved: 17,
    avatar_url: '',
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit') || 25);

    try {
      const data = await getLeaderboard(limit);
      if (data && data.length > 0) {
        return NextResponse.json({ leaderboard: data });
      }
    } catch (dbErr) {
      console.warn('Supabase leaderboard fetch fallback:', dbErr);
    }

    return NextResponse.json({ leaderboard: MOCK_LEADERBOARD.slice(0, limit) });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

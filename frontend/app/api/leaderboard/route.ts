import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/backend/services/credits';

export const runtime = 'nodejs';



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit') || 25);

    const data = await getLeaderboard(limit);
    return NextResponse.json({ leaderboard: data || [] });
  } catch (err: any) {
    console.error('Leaderboard error:', err);
    return NextResponse.json({ leaderboard: [] });
  }
}

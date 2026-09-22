import { NextRequest, NextResponse } from 'next/server';
import { getUserCredits, REDEEM_THRESHOLD } from '@/backend/services/credits';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';
    const username = searchParams.get('username') || '';
    const fullName = searchParams.get('fullName') || '';

    if (!userId && !username) {
      return NextResponse.json({ error: 'User identifier is required' }, { status: 400 });
    }

    try {
      const data = await getUserCredits(userId, username, fullName);
      return NextResponse.json(data);
    } catch (dbErr) {
      return NextResponse.json({
        totalCredits: 0,
        redeemedCredits: 0,
        availableCredits: 0,
        papersApproved: 0,
        history: [],
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

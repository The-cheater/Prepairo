import { NextRequest, NextResponse } from 'next/server';
import { getUserCredits, REDEEM_THRESHOLD } from '@/backend/services/credits';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
      const data = await getUserCredits(userId);
      return NextResponse.json(data);
    } catch (dbErr) {
      // Fallback for offline/demo mode
      return NextResponse.json({
        totalCredits: 30,
        redeemedCredits: 0,
        availableCredits: 30,
        papersApproved: 3,
        canRedeem: false,
        redeemThreshold: REDEEM_THRESHOLD,
        history: [],
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

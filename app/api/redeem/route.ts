import { NextRequest, NextResponse } from 'next/server';
import { requestRedeem, REDEEM_THRESHOLD } from '@/backend/services/credits';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, paymentInfo } = body;

    if (!userId || !paymentInfo) {
      return NextResponse.json({ error: 'User ID and payment info are required' }, { status: 400 });
    }

    const redeemAmount = Number(amount || REDEEM_THRESHOLD);

    try {
      const request = await requestRedeem(userId, redeemAmount, paymentInfo);
      return NextResponse.json({
        success: true,
        message: `Redeem request for ${redeemAmount} credits submitted successfully! Admin will process your payout.`,
        request,
      });
    } catch (err: any) {
      // If error is insufficient credits, return 400
      return NextResponse.json({ error: err.message || 'Redeem request failed' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

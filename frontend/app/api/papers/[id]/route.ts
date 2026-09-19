import { NextRequest, NextResponse } from 'next/server';
import { updatePaper } from '@/backend/db/db';
import { awardCredits } from '@/backend/services/credits';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updates: Record<string, any> = { ...body };

    if (body.status === 'verified') {
      updates.verifiedAt = new Date().toISOString();
      if (body.comment) {
        updates.adminComment = body.comment;
      }
      delete updates.rejectionReason;
    } else if (body.status === 'rejected') {
      const reason = body.comment || body.rejectionReason || 'Disapproved by admin';
      updates.rejectionReason = reason;
      updates.adminComment = reason;
    }

    const updated = updatePaper(id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Paper not found' }, { status: 404 });
    }

    // If verified and paper has an uploaderId, award 10 credits!
    if (body.status === 'verified' && updated.uploaderId) {
      try {
        await awardCredits(updated.uploaderId, updated.id);
      } catch (creditErr) {
        console.warn('Could not award credits via Supabase:', creditErr);
      }
    }

    return NextResponse.json({ success: true, paper: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update paper' }, { status: 500 });
  }
}


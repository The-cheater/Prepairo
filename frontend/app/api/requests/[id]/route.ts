import { NextRequest, NextResponse } from 'next/server';
import { updateRequest } from '@/backend/db/db';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = updateRequest(id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update request' }, { status: 500 });
  }
}

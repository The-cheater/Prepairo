import { NextRequest, NextResponse } from 'next/server';
import { getAllRequests, saveRequest } from '@/backend/db/db';
import { PaperRequest } from '@/backend/models/mock-papers';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let requests = getAllRequests();
    if (status && status !== 'all') {
      requests = requests.filter(r => r.status === status);
    }

    return NextResponse.json({ requests, total: requests.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRequest: PaperRequest = {
      ...body,
      id: `req-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    saveRequest(newRequest);
    return NextResponse.json({ success: true, request: newRequest });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create request' }, { status: 500 });
  }
}

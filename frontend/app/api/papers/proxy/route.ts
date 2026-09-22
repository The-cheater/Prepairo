import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');
    const filename = req.nextUrl.searchParams.get('filename') || 'document.pdf';

    if (!url) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    // Decode URL if necessary
    const decodedUrl = decodeURIComponent(url);

    // Fetch the remote asset (Cloudinary or other)
    const remoteRes = await fetch(decodedUrl);
    if (!remoteRes.ok) {
      return new NextResponse(`Failed to fetch PDF: ${remoteRes.statusText}`, { status: remoteRes.status });
    }

    const arrayBuffer = await remoteRes.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        'Access-Control-Allow-Origin': '*',
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
    });
  } catch (err: any) {
    console.error('PDF proxy error:', err);
    return new NextResponse('Internal server error streaming PDF', { status: 500 });
  }
}

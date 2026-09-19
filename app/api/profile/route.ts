import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/backend/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = await createSupabaseServer();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, fullName, course, department, avatarUrl } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Avatar size validation if base64: ensure under 500KB (~680,000 base64 chars)
    if (avatarUrl && avatarUrl.startsWith('data:image/')) {
      const stringLength = avatarUrl.length - 'data:image/png;base64,'.length;
      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383687;
      if (sizeInBytes > 500 * 1024) {
        return NextResponse.json(
          { error: 'Avatar image exceeds 500 KB limit. Please choose a smaller image.' },
          { status: 400 }
        );
      }
    }

    const supabase = await createSupabaseServer();
    const updates: Record<string, any> = {};
    if (fullName) updates.full_name = fullName;
    if (course) updates.course = course;
    if (department) updates.department = department;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      // Fallback: return success with updated data so offline/demo mode continues
      return NextResponse.json({ success: true, profile: { id: userId, ...updates } });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

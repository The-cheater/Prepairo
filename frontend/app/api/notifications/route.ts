import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const notificationsFilePath = path.join(process.cwd(), 'data', 'notifications.json');

export interface UserNotification {
  id: string;
  recipientUsername: string;
  senderUsername: string;
  senderName: string;
  senderAvatar?: string;
  channelId: string;
  messageSnippet: string;
  type: 'mention' | 'reply';
  isRead: boolean;
  createdAt: string;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lefonaaqbxhqzxczjlnw.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_qZ_NQmtw0EHHrZEs-o1Fgg_Mk2sYGhh';
  return createClient(url, key);
}

function getStoredNotifications(): UserNotification[] {
  try {
    if (!fs.existsSync(notificationsFilePath)) return [];
    const data = fs.readFileSync(notificationsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveNotifications(notifications: UserNotification[]) {
  try {
    const dir = path.dirname(notificationsFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(notificationsFilePath, JSON.stringify(notifications, null, 2));
  } catch (err) {
    console.warn('Fallback notifications file write warning:', err);
  }
}

function mapRowToNotification(row: any): UserNotification {
  return {
    id: row.id,
    recipientUsername: row.recipient_username,
    senderUsername: row.sender_username,
    senderName: row.sender_name,
    senderAvatar: row.sender_avatar || '',
    channelId: row.channel_id,
    messageSnippet: row.message_snippet,
    type: row.type || 'reply',
    isRead: Boolean(row.is_read),
    createdAt: row.created_at
  };
}

// GET /api/notifications?username=alice
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const cleanUser = username.toLowerCase();

  // 1. Try fetching from Supabase Postgres
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('community_notifications')
      .select('*')
      .ilike('recipient_username', cleanUser)
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && data && data.length > 0) {
      const notifs = data.map(mapRowToNotification);
      const unreadCount = notifs.filter(n => !n.isRead).length;
      return NextResponse.json({ notifications: notifs, unreadCount });
    }
  } catch (e) {
    console.warn('Supabase notifications GET notice:', e);
  }

  // 2. Fallback to local file
  const all = getStoredNotifications();
  const userNotifs = all.filter(
    n => n.recipientUsername.toLowerCase() === cleanUser
  );
  const unreadCount = userNotifs.filter(n => !n.isRead).length;

  return NextResponse.json({
    notifications: userNotifs.slice(0, 30),
    unreadCount
  });
}

// PATCH /api/notifications (mark read)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, markAllRead, username } = body;

    // 1. Update Supabase
    try {
      const supabase = getSupabase();
      if (markAllRead && username) {
        await supabase
          .from('community_notifications')
          .update({ is_read: true })
          .ilike('recipient_username', username.toLowerCase());
      } else if (notificationId) {
        await supabase
          .from('community_notifications')
          .update({ is_read: true })
          .eq('id', notificationId);
      }
    } catch (e) {
      console.warn('Supabase notification mark-read notice:', e);
    }

    // 2. Mirror in local file
    const all = getStoredNotifications();
    if (markAllRead && username) {
      all.forEach(n => {
        if (n.recipientUsername.toLowerCase() === username.toLowerCase()) {
          n.isRead = true;
        }
      });
    } else if (notificationId) {
      const target = all.find(n => n.id === notificationId);
      if (target) target.isRead = true;
    }
    saveNotifications(all);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

function getStoredNotifications(): UserNotification[] {
  try {
    if (!fs.existsSync(notificationsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(notificationsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveNotifications(notifications: UserNotification[]) {
  try {
    const dir = path.dirname(notificationsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(notificationsFilePath, JSON.stringify(notifications, null, 2));
  } catch (err) {
    console.error('Failed to write notifications.json:', err);
  }
}

// GET /api/notifications?username=alice
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const all = getStoredNotifications();
  const userNotifs = all.filter(
    n => n.recipientUsername.toLowerCase() === username.toLowerCase()
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

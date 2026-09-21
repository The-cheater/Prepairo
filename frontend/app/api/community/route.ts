import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const messagesFilePath = path.join(process.cwd(), 'data', 'messages.json');
const notificationsFilePath = path.join(process.cwd(), 'data', 'notifications.json');

export interface CommunityMessage {
  id: string;
  channelId: string;
  content: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  authorBatch?: string;
  tag?: string;
  taggedUsernames: string[];
  createdAt: string;
  likes: number;
}

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

function getStoredMessages(): CommunityMessage[] {
  try {
    if (!fs.existsSync(messagesFilePath)) {
      return [];
    }
    const data = fs.readFileSync(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveMessages(messages: CommunityMessage[]) {
  try {
    const dir = path.dirname(messagesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error('Failed to write messages.json:', err);
  }
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

// GET /api/community?channel=physics
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channel');
  const limit = Number(searchParams.get('limit')) || 100;

  const messages = getStoredMessages();
  let filtered = messages;
  if (channelId && channelId !== 'all') {
    filtered = filtered.filter(m => m.channelId === channelId);
  }

  // Sort ascending by creation time
  filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return NextResponse.json({
    messages: filtered.slice(-limit),
    totalCount: filtered.length
  });
}

// POST /api/community
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      channelId = 'general',
      content,
      tag = 'General',
      authorName = 'Student',
      authorUsername = 'student',
      authorAvatar = '',
      authorBatch = ''
    } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 });
    }

    // Extract @mentions
    const mentionRegex = /@([a-zA-Z0-9_\-]+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      const username = match[1].toLowerCase();
      if (!mentions.includes(username) && username !== authorUsername.toLowerCase()) {
        mentions.push(username);
      }
    }

    const newMessage: CommunityMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      channelId,
      content: content.trim(),
      authorName,
      authorUsername,
      authorAvatar,
      authorBatch,
      tag,
      taggedUsernames: mentions,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    const messages = getStoredMessages();
    messages.push(newMessage);
    saveMessages(messages);

    // Create notifications for tagged users
    if (mentions.length > 0) {
      const notifications = getStoredNotifications();
      const snippet = content.length > 80 ? `${content.substring(0, 80)}...` : content;

      for (const username of mentions) {
        const notif: UserNotification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          recipientUsername: username,
          senderUsername: authorUsername,
          senderName: authorName,
          senderAvatar: authorAvatar,
          channelId,
          messageSnippet: snippet,
          type: 'mention',
          isRead: false,
          createdAt: new Date().toISOString()
        };
        notifications.unshift(notif);
      }
      saveNotifications(notifications.slice(0, 200)); // retain last 200 notifications
    }

    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch (err: any) {
    console.error('Community POST error:', err);
    return NextResponse.json({ error: 'Failed to post message' }, { status: 500 });
  }
}

// PATCH /api/community (Like message)
export async function PATCH(request: Request) {
  try {
    const { messageId, action } = await request.json();
    if (!messageId) {
      return NextResponse.json({ error: 'Missing messageId' }, { status: 400 });
    }

    const messages = getStoredMessages();
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    if (action === 'like') {
      messages[idx].likes = (messages[idx].likes || 0) + 1;
    }
    saveMessages(messages);

    return NextResponse.json({ success: true, likes: messages[idx].likes });
  } catch {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

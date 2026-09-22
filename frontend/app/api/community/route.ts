import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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
  replyToMessageId?: string;
  replyToUsername?: string;
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

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lefonaaqbxhqzxczjlnw.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_qZ_NQmtw0EHHrZEs-o1Fgg_Mk2sYGhh';
  return createClient(url, key);
}

// Fallback disk helpers
function getStoredMessages(): CommunityMessage[] {
  try {
    if (!fs.existsSync(messagesFilePath)) return [];
    const data = fs.readFileSync(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveMessages(messages: CommunityMessage[]) {
  try {
    const dir = path.dirname(messagesFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
  } catch (err) {
    console.warn('Fallback messages file write warning:', err);
  }
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

function mapRowToMessage(row: any): CommunityMessage {
  return {
    id: row.id,
    channelId: row.channel_id,
    content: row.content,
    authorName: row.author_name,
    authorUsername: row.author_username,
    authorAvatar: row.author_avatar || '',
    authorBatch: row.author_batch || '',
    tag: row.tag || 'General',
    taggedUsernames: row.tagged_usernames || [],
    createdAt: row.created_at,
    likes: row.likes || 0
  };
}

// GET /api/community?channel=physics
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channel');
  const limit = Number(searchParams.get('limit')) || 100;

  try {
    const supabase = getSupabase();
    let query = supabase
      .from('community_messages')
      .select('*');

    if (channelId && channelId !== 'all') {
      query = query.eq('channel_id', channelId);
    }

    const { data, error } = await query
      .order('created_at', { ascending: true })
      .limit(limit);

    if (!error && data && data.length > 0) {
      const messages = data.map(mapRowToMessage);
      return NextResponse.json({ messages, totalCount: messages.length });
    }
  } catch (dbErr) {
    console.warn('Supabase community GET notice:', dbErr);
  }

  // Fallback to local storage if Supabase returned empty/error
  const messages = getStoredMessages();
  let filtered = messages;
  if (channelId && channelId !== 'all') {
    filtered = filtered.filter(m => m.channelId === channelId);
  }
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
      authorBatch = '',
      replyToUsername,
      replyToMessageId
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

    // If this is an explicit reply to a user, include them in mentions
    if (replyToUsername && replyToUsername.toLowerCase() !== authorUsername.toLowerCase()) {
      const rep = replyToUsername.toLowerCase();
      if (!mentions.includes(rep)) {
        mentions.push(rep);
      }
    }

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newMessage: CommunityMessage = {
      id: msgId,
      channelId,
      content: content.trim(),
      authorName,
      authorUsername,
      authorAvatar,
      authorBatch,
      tag,
      taggedUsernames: mentions,
      createdAt: nowIso,
      likes: 0,
      replyToMessageId,
      replyToUsername
    };

    // 1. Primary write to Supabase
    try {
      const supabase = getSupabase();
      await supabase.from('community_messages').insert({
        id: msgId,
        channel_id: channelId,
        content: content.trim(),
        author_name: authorName,
        author_username: authorUsername,
        author_avatar: authorAvatar,
        author_batch: authorBatch,
        tag,
        tagged_usernames: mentions,
        likes: 0,
        created_at: nowIso
      });
    } catch (dbErr) {
      console.warn('Supabase community message insert error:', dbErr);
    }

    // 2. Mirror to local file for offline resilience
    const localMsgs = getStoredMessages();
    localMsgs.push(newMessage);
    saveMessages(localMsgs);

    // 3. Create notifications for replied or tagged users
    if (mentions.length > 0) {
      const snippet = content.length > 90 ? `${content.substring(0, 90)}...` : content;
      const notificationsToSave: UserNotification[] = [];

      for (const username of mentions) {
        // Tag as 'reply' if replying or answering in channel
        const notifType: 'reply' | 'mention' = (replyToUsername && replyToUsername.toLowerCase() === username.toLowerCase())
          ? 'reply'
          : 'reply'; // All direct responses to students are tagged as replies

        const notif: UserNotification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          recipientUsername: username,
          senderUsername: authorUsername,
          senderName: authorName,
          senderAvatar: authorAvatar,
          channelId,
          messageSnippet: snippet,
          type: notifType,
          isRead: false,
          createdAt: nowIso
        };

        notificationsToSave.push(notif);

        // Insert into Supabase notifications table
        try {
          const supabase = getSupabase();
          await supabase.from('community_notifications').insert({
            id: notif.id,
            recipient_username: notif.recipientUsername,
            sender_username: notif.senderUsername,
            sender_name: notif.senderName,
            sender_avatar: notif.senderAvatar,
            channel_id: notif.channelId,
            message_snippet: notif.messageSnippet,
            type: notif.type,
            is_read: false,
            created_at: notif.createdAt
          });
        } catch (notifDbErr) {
          console.warn('Supabase notification insert notice:', notifDbErr);
        }
      }

      // Mirror to local notifications file
      const localNotifs = getStoredNotifications();
      notificationsToSave.forEach(n => localNotifs.unshift(n));
      saveNotifications(localNotifs.slice(0, 200));
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

    let updatedLikes = 0;

    // 1. Update Supabase
    try {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('community_messages')
        .select('likes')
        .eq('id', messageId)
        .single();

      if (data) {
        updatedLikes = (data.likes || 0) + (action === 'like' ? 1 : 0);
        await supabase
          .from('community_messages')
          .update({ likes: updatedLikes })
          .eq('id', messageId);
      }
    } catch (e) {
      console.warn('Supabase like update notice:', e);
    }

    // 2. Mirror in local file
    const messages = getStoredMessages();
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx !== -1) {
      if (action === 'like') {
        messages[idx].likes = (messages[idx].likes || 0) + 1;
        updatedLikes = messages[idx].likes;
      }
      saveMessages(messages);
    }

    return NextResponse.json({ success: true, likes: updatedLikes });
  } catch {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

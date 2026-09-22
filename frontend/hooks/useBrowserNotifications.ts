'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserNotification } from '@/frontend/app/api/notifications/route';

const SEEN_NOTIFS_STORAGE_KEY = 'prepairo_seen_browser_notifs_v1';

function getSeenNotifIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = sessionStorage.getItem(SEEN_NOTIFS_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markNotifSeen(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const set = getSeenNotifIds();
    set.add(id);
    sessionStorage.setItem(SEEN_NOTIFS_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function useBrowserNotifications(onNavigate?: (url: string) => void) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    } else {
      setPermission('unsupported');
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res === 'granted';
    } catch {
      return false;
    }
  }, []);

  const triggerReplyNotification = useCallback((notif: UserNotification) => {
    if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    // STRICT FILTER: Only trigger for replies where a user has asked something and someone replied
    if (notif.type !== 'reply') {
      return;
    }

    // Prevent duplicate pop-ups for the same notification
    const seen = getSeenNotifIds();
    if (seen.has(notif.id)) {
      return;
    }
    markNotifSeen(notif.id);

    try {
      const title = `${notif.senderName} replied to your question in #${notif.channelId}`;
      const options: NotificationOptions = {
        body: notif.messageSnippet,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: `reply-${notif.id}`,
      };

      const browserNotif = new Notification(title, options);

      browserNotif.onclick = () => {
        window.focus();
        const targetUrl = `/community?channel=${notif.channelId}`;
        if (onNavigate) {
          onNavigate(targetUrl);
        } else {
          window.location.href = targetUrl;
        }
        browserNotif.close();
      };
    } catch (e) {
      console.warn('Browser notification trigger warning:', e);
    }
  }, [onNavigate]);

  const processIncomingNotifications = useCallback((notifications: UserNotification[]) => {
    if (permission !== 'granted') return;

    // Filter strictly for unread replies
    const unreadReplies = notifications.filter(n => !n.isRead && n.type === 'reply');
    const seen = getSeenNotifIds();

    for (const notif of unreadReplies) {
      if (!seen.has(notif.id)) {
        triggerReplyNotification(notif);
      }
    }
  }, [permission, triggerReplyNotification]);

  return {
    isSupported,
    permission,
    requestPermission,
    triggerReplyNotification,
    processIncomingNotifications,
  };
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, MessageSquare, AtSign, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '@/frontend/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/frontend/lib/api';
import { useBrowserNotifications } from '@/frontend/hooks/useBrowserNotifications';

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

export default function NotificationBell() {
  const { profile } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { permission, requestPermission, processIncomingNotifications } = useBrowserNotifications(
    (url) => router.push(url)
  );

  const fetchNotifications = async () => {
    if (!profile?.username) return;
    try {
      const res = await fetch(getApiUrl(`/api/notifications?username=${encodeURIComponent(profile.username)}`));
      if (res.ok) {
        const data = await res.json();
        const incoming = data.notifications || [];
        setNotifications(incoming);
        setUnreadCount(data.unreadCount || 0);
        processIncomingNotifications(incoming);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [profile?.username]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    if (!profile?.username) return;
    try {
      await fetch(getApiUrl('/api/notifications'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true, username: profile.username })
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleNotificationClick = async (notif: UserNotification) => {
    try {
      if (!notif.isRead) {
        await fetch(getApiUrl('/api/notifications'), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: notif.id })
        });
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch {}
    setIsOpen(false);
    router.push(`/community?channel=${notif.channelId}`);
  };

  if (!profile) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        title="Notifications"
        aria-label="View notifications"
        className="relative p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 sm:right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-cal text-sm font-bold text-zinc-950 dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* Browser Notification Opt-In Banner (Only when default) */}
          {permission === 'default' && (
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 flex items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-blue-950 dark:text-blue-200 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Desktop Reply Alerts</span>
                </p>
                <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-tight">
                  Get notified only when someone answers your question
                </p>
              </div>
              <button
                onClick={requestPermission}
                className="px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
              >
                Enable
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 sm:p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer flex items-start gap-3 ${
                    !notif.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                  }`}
                >
                  {/* Sender Avatar */}
                  <div className="flex-shrink-0 relative mt-0.5">
                    {notif.senderAvatar ? (
                      <img
                        src={notif.senderAvatar}
                        alt={notif.senderName}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        {notif.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[9px]">
                      {notif.type === 'reply' ? <MessageSquare className="w-2.5 h-2.5 text-amber-400" /> : <AtSign className="w-2.5 h-2.5" />}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs text-zinc-900 dark:text-zinc-100 leading-snug">
                      <strong className="font-semibold text-zinc-950 dark:text-white">
                        {notif.senderName}
                      </strong>{' '}
                      {notif.type === 'reply' ? (
                        <>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">replied to your question</span> in{' '}
                        </>
                      ) : (
                        'tagged you in '
                      )}
                      <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono">
                        #{notif.channelId}
                      </span>
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 italic">
                      &ldquo;{notif.messageSnippet}&rdquo;
                    </p>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 block">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-10 px-4 text-center space-y-2 text-zinc-400 dark:text-zinc-500">
                <Bell className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">No notifications yet</p>
                <p className="text-[11px] max-w-[220px] mx-auto">
                  When seniors or batchmates tag you with @{profile.username}, you will get notified here!
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/community');
              }}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Open Community Hub</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

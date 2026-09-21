'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/frontend/components/auth/AuthProvider';
import {
  Send,
  Sparkles,
  Heart,
  MessageSquare,
  AtSign,
  Flame,
  Star,
  HelpCircle,
  Lightbulb,
  Compass,
  Dna,
  FlaskConical,
  Atom,
  Binary,
  Globe2,
  BookOpen,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getApiUrl } from '@/frontend/lib/api';

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

export const CHANNELS = [
  { id: 'general', name: 'General & Strategy', icon: MessageSquare, desc: 'Exam tips, high chance question talk, general doubts' },
  { id: 'foundation', name: 'Foundation (Years 1–2)', icon: Compass, desc: 'Core Math, Physics, Chemistry, Biology & Computing' },
  { id: 'physics', name: 'Physical Sciences', icon: Atom, desc: 'Mechanics, Quantum, Electrodynamics & Optics' },
  { id: 'biology', name: 'Biological Sciences', icon: Dna, desc: 'Biochemistry, Genetics, Ecology & Cell Bio' },
  { id: 'chemistry', name: 'Chemical Sciences', icon: FlaskConical, desc: 'Organic, Inorganic & Physical Chemistry' },
  { id: 'mathematics', name: 'Mathematical Sciences', icon: BookOpen, desc: 'Linear Algebra, Analysis, Calculus & Topology' },
  { id: 'data-science', name: 'Data Science', icon: Binary, desc: 'Machine Learning, Stats, Algorithms & Python' },
  { id: 'earth-sciences', name: 'Earth & Planetary', icon: Globe2, desc: 'Geology, Climate, Planetary & Environmental' },
];

export const DOUBT_TAGS = [
  { id: 'all', label: 'All Messages' },
  { id: 'High Chance', label: 'High Chance Questions', short: 'High Chance', icon: Flame },
  { id: 'Important Topic', label: 'Important Topics', short: 'Important Topic', icon: Star },
  { id: 'PYQ Doubt', label: 'Past Paper Doubt', short: 'PYQ Doubt', icon: HelpCircle },
  { id: 'Senior Advice', label: 'Ask a Senior', short: 'Senior Advice', icon: Lightbulb },
];

export default function CommunityChat() {
  const { user, profile } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeChannelParam = searchParams.get('channel') || 'general';
  const [activeChannel, setActiveChannel] = useState(activeChannelParam);
  const [selectedTag, setSelectedTag] = useState('all');

  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [composerTag, setComposerTag] = useState('High Chance');
  const [isSending, setIsSending] = useState(false);
  const [likedMessageIds, setLikedMessageIds] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync active channel with URL
  useEffect(() => {
    if (activeChannelParam && activeChannelParam !== activeChannel) {
      setActiveChannel(activeChannelParam);
    }
  }, [activeChannelParam]);

  const selectChannel = (channelId: string) => {
    setActiveChannel(channelId);
    router.push(`/community?channel=${channelId}`, { scroll: false });
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(getApiUrl(`/api/community?channel=${activeChannel}`));
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); // Poll every 4 seconds for new messages
    return () => clearInterval(interval);
  }, [activeChannel]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending || !profile) return;

    setIsSending(true);
    try {
      const res = await fetch(getApiUrl('/api/community'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: activeChannel,
          content: inputText.trim(),
          tag: composerTag,
          authorName: profile.fullName || profile.username,
          authorUsername: profile.username,
          authorAvatar: profile.avatarUrl || '',
          authorBatch: profile.batch || 'Student'
        })
      });

      if (res.ok) {
        setInputText('');
        await fetchMessages();
      }
    } catch {} finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLike = async (messageId: string) => {
    if (likedMessageIds[messageId]) return;
    setLikedMessageIds(prev => ({ ...prev, [messageId]: true }));
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, likes: m.likes + 1 } : m));

    try {
      await fetch(getApiUrl('/api/community'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, action: 'like' })
      });
    } catch {}
  };

  const replyToAuthor = (authorUsername: string) => {
    setInputText(prev => {
      const tag = `@${authorUsername} `;
      if (prev.includes(tag)) return prev;
      return `${tag}${prev}`;
    });
    textareaRef.current?.focus();
  };

  const currentChannelMeta = CHANNELS.find(c => c.id === activeChannel) || CHANNELS[0];

  // Filter messages by tag
  const filteredMessages = messages.filter(m => {
    if (selectedTag === 'all') return true;
    if (!m.tag) return false;
    const normMsgTag = m.tag.replace(/[^\w\s-]/g, '').trim().toLowerCase();
    const normSelected = selectedTag.replace(/[^\w\s-]/g, '').trim().toLowerCase();
    return normMsgTag.includes(normSelected) || normSelected.includes(normMsgTag);
  });

  // Render text with highlighted @mentions
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9_\-]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span
            key={i}
            className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold font-mono text-[11px] mx-0.5"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* 1. Left Channel Sidebar (Desktop) & Top Tabs (Mobile) */}
      <div className="lg:col-span-4 space-y-3">
        
        {/* Mobile Horizontal Scrollable Channel Selector */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CHANNELS.map(ch => {
            const Icon = ch.icon;
            const isActive = ch.id === activeChannel;
            return (
              <button
                key={ch.id}
                onClick={() => selectChannel(ch.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ch.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Channel List Card */}
        <div className="hidden lg:block bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm space-y-2">
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Department Channels
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
              8 Channels
            </span>
          </div>

          <div className="space-y-1">
            {CHANNELS.map(ch => {
              const Icon = ch.icon;
              const isActive = ch.id === activeChannel;
              return (
                <button
                  key={ch.id}
                  onClick={() => selectChannel(ch.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xs'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-white/20 dark:bg-black/10' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{ch.name}</p>
                      <p className={`text-[10px] truncate ${isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'}`}>
                        {ch.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Ask a Senior Highlight Tip Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-zinc-900 dark:to-zinc-900/80 rounded-3xl border border-blue-200/80 dark:border-zinc-800 p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-semibold text-xs">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Ask Seniors What&apos;s Important</span>
          </div>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Tag questions with <strong className="text-zinc-900 dark:text-white inline-flex items-center gap-1"><Flame className="w-3 h-3 text-amber-500" /> High Chance</strong> or <strong className="text-zinc-900 dark:text-white inline-flex items-center gap-1"><Star className="w-3 h-3 text-blue-500" /> Important Topic</strong> so seniors can guide you on key exam topics!
          </p>
        </div>

      </div>

      {/* 2. Main Chat Feed & Composer */}
      <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-[700px] overflow-hidden">
        
        {/* Active Channel Header */}
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cal text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
                #{currentChannelMeta.name}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono">
                {filteredMessages.length} {filteredMessages.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {currentChannelMeta.desc}
            </p>
          </div>

          {/* Doubt Filter Tag Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {DOUBT_TAGS.map(t => {
              const TagIcon = 'icon' in t ? t.icon : null;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTag(t.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    selectedTag === t.id
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-2xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {TagIcon && <TagIcon className="w-3 h-3" />}
                  <span>{t.short || t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map(msg => {
              const isCurrentUser = profile?.username && msg.authorUsername.toLowerCase() === profile.username.toLowerCase();
              const isTagged = profile?.username && msg.taggedUsernames?.includes(profile.username.toLowerCase());

              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-3xl border transition-all ${
                    isTagged
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-800/80 shadow-xs'
                      : isCurrentUser
                      ? 'bg-blue-50/30 dark:bg-blue-950/10 border-blue-200/60 dark:border-blue-900/40'
                      : 'bg-zinc-50/60 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-800'
                  }`}
                >
                  {/* Top Bar: Author, Tag & Timestamp */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {msg.authorAvatar ? (
                        <img
                          src={msg.authorAvatar}
                          alt={msg.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {msg.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-cal text-xs font-bold text-zinc-950 dark:text-white">
                            {msg.authorName}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            @{msg.authorUsername}
                          </span>
                          {msg.authorBatch && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md font-medium">
                              {msg.authorBatch}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Doubt Tag Badge */}
                    {msg.tag && (() => {
                      const tagMeta = DOUBT_TAGS.find(t => 
                        t.id.toLowerCase() === msg.tag?.toLowerCase() || 
                        t.label.toLowerCase() === msg.tag?.toLowerCase() ||
                        (t.short && msg.tag?.toLowerCase().includes(t.short.toLowerCase()))
                      );
                      const TagIcon = tagMeta && 'icon' in tagMeta ? tagMeta.icon : null;
                      const cleanLabel = tagMeta?.short || msg.tag.replace(/[^\w\s-]/g, '').trim();
                      return (
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-2xs inline-flex items-center gap-1">
                          {TagIcon && <TagIcon className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                          <span>{cleanLabel}</span>
                        </span>
                      );
                    })()}
                  </div>

                  {/* Message Content */}
                  <div className="mt-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {renderMessageContent(msg.content)}
                  </div>

                  {/* Bottom Actions: Helpful like & Quick Reply */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleLike(msg.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                        likedMessageIds[msg.id]
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedMessageIds[msg.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{msg.likes > 0 ? `${msg.likes} Helpful` : 'Helpful'}</span>
                    </button>

                    <button
                      onClick={() => replyToAuthor(msg.authorUsername)}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <AtSign className="w-3 h-3" />
                      <span>Reply @{msg.authorUsername}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center space-y-3 text-zinc-400 dark:text-zinc-500">
              <MessageSquare className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                No discussions in #{currentChannelMeta.name} yet
              </p>
              <p className="text-xs max-w-sm mx-auto">
                Be the first student to ask a doubt, share an expected question, or seek advice from seniors!
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer */}
        <div className="p-3 sm:p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5">
          {profile ? (
            <form onSubmit={handleSendMessage} className="space-y-2">
              
              {/* Tag Selector Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                  Tag:
                </span>
                {DOUBT_TAGS.slice(1).map(t => {
                  const TagIcon = 'icon' in t ? t.icon : null;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setComposerTag(t.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1 ${
                        composerTag === t.id
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {TagIcon && <TagIcon className="w-3 h-3" />}
                      <span>{t.short || t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Text Input Row */}
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    placeholder={`Ask doubts or share high-chance questions in #${currentChannelMeta.name}... (Type @username to tag)`}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="p-3 sm:px-4 sm:py-3 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 px-1">
                <span>Press <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for newline</span>
                <span>Tag seniors using <strong>@username</strong> for notifications</span>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">
                  Join the #{currentChannelMeta.name} Discussion
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Sign in with Google to post doubts, ask seniors about important topics, and receive mention notifications!
                </p>
              </div>
              <Link
                href="/login"
                className="btn-pill-black text-xs px-5 py-2 whitespace-nowrap flex-shrink-0"
              >
                Sign In to Chat
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

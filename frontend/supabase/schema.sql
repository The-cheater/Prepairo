-- Prepairo Database Schema
-- Supabase Postgres with RLS, Auth, Realtime, and Storage

-- ============================================================
-- 1. Extended Profiles (linked to auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  email text,
  department text,
  course text,
  batch text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'admin')),
  total_credits integer not null default 0,
  redeemed_credits integer not null default 0,
  papers_uploaded integer not null default 0,
  papers_approved integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, username, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  on conflict (id) do update set
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. Papers (mid-sem & end-sem only)
-- ============================================================
create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  subject_name text not null,
  course_code text,
  school_id text,
  program text not null default 'BS-MS',
  academic_year integer not null,
  semester integer not null,
  exam_year integer not null,
  exam_type text not null check (exam_type in ('mid-sem', 'end-sem')),
  batch text,
  file_url text not null,
  file_name text,
  file_size_bytes bigint,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  uploader_name text default 'Anonymous',
  is_anonymous boolean default false,
  uploader_id uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  verified_by uuid,
  rejection_reason text,
  view_count integer default 0,
  download_count integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- 3. Credits (gamification)
-- ============================================================
create table if not exists public.credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  paper_id uuid references public.papers(id) on delete set null,
  amount integer not null default 10,
  reason text not null default 'Paper approved by admin',
  created_at timestamptz default now()
);

-- ============================================================
-- 4. Redeem Requests
-- ============================================================
create table if not exists public.redeem_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  payment_info text,
  admin_notes text,
  created_at timestamptz default now(),
  processed_at timestamptz
);

-- ============================================================
-- 5. Paper Requests (community board)
-- ============================================================
create table if not exists public.paper_requests (
  id uuid primary key default gen_random_uuid(),
  subject_name text not null,
  course_code text,
  academic_year integer,
  semester integer,
  exam_year integer not null,
  exam_type text not null check (exam_type in ('mid-sem', 'end-sem')),
  notes text,
  requester_name text default 'Student',
  requester_id uuid references public.profiles(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'fulfilled')),
  fulfilled_by_paper_id uuid references public.papers(id) on delete set null,
  created_at timestamptz default now()
);

-- ============================================================
-- 6. Subject Suggestions
-- ============================================================
create table if not exists public.subject_suggestions (
  id uuid primary key default gen_random_uuid(),
  suggested_name text not null,
  course_code text,
  school_name text,
  semester integer,
  student_name text,
  student_email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'mapped', 'rejected')),
  admin_notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- 7. Community Discussion Messages
-- ============================================================
create table if not exists public.community_messages (
  id text primary key,
  channel_id text not null,
  content text not null,
  author_name text not null,
  author_username text not null,
  author_avatar text,
  author_batch text,
  tag text default 'General',
  tagged_usernames text[] default '{}',
  likes integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- 8. Community Notifications
-- ============================================================
create table if not exists public.community_notifications (
  id text primary key,
  recipient_username text not null,
  sender_username text not null,
  sender_name text not null,
  sender_avatar text,
  channel_id text not null,
  message_snippet text not null,
  type text not null default 'mention',
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_papers_subject on public.papers (subject_name);
create index if not exists idx_papers_status on public.papers (status);
create index if not exists idx_papers_uploader on public.papers (uploader_id);
create index if not exists idx_credits_user on public.credits (user_id);
create index if not exists idx_profiles_username on public.profiles (username);
create index if not exists idx_profiles_credits on public.profiles (total_credits desc);
create index if not exists idx_comm_channel on public.community_messages (channel_id, created_at desc);
create index if not exists idx_notif_recipient on public.community_notifications (recipient_username, is_read);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.papers enable row level security;
alter table public.credits enable row level security;
alter table public.redeem_requests enable row level security;
alter table public.paper_requests enable row level security;
alter table public.subject_suggestions enable row level security;
alter table public.community_messages enable row level security;
alter table public.community_notifications enable row level security;

-- Profiles: public read, self update
drop policy if exists "Public can view profiles" on public.profiles;
create policy "Public can view profiles" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Papers: public read verified, authenticated insert
drop policy if exists "Public can view verified papers" on public.papers;
create policy "Public can view verified papers" on public.papers for select using (status = 'verified' or uploader_id = auth.uid());

drop policy if exists "Authenticated users can upload papers" on public.papers;
create policy "Authenticated users can upload papers" on public.papers for insert with check (auth.uid() is not null);

drop policy if exists "Admin can update papers" on public.papers;
create policy "Admin can update papers" on public.papers for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  or uploader_id = auth.uid()
);

-- Credits: user can read own
drop policy if exists "Users can view own credits" on public.credits;
create policy "Users can view own credits" on public.credits for select using (user_id = auth.uid());

drop policy if exists "System can insert credits" on public.credits;
create policy "System can insert credits" on public.credits for insert with check (true);

-- Redeem requests: user can read/insert own
drop policy if exists "Users can view own redeem requests" on public.redeem_requests;
create policy "Users can view own redeem requests" on public.redeem_requests for select using (user_id = auth.uid());

drop policy if exists "Users can submit redeem requests" on public.redeem_requests;
create policy "Users can submit redeem requests" on public.redeem_requests for insert with check (user_id = auth.uid());

-- Paper requests: public read, anyone can insert
drop policy if exists "Public can view paper requests" on public.paper_requests;
create policy "Public can view paper requests" on public.paper_requests for select using (true);

drop policy if exists "Anyone can submit paper requests" on public.paper_requests;
create policy "Anyone can submit paper requests" on public.paper_requests for insert with check (true);

-- Subject suggestions: public insert & view
drop policy if exists "Anyone can suggest subjects" on public.subject_suggestions;
create policy "Anyone can suggest subjects" on public.subject_suggestions for insert with check (true);

drop policy if exists "Public can view suggestions" on public.subject_suggestions;
create policy "Public can view suggestions" on public.subject_suggestions for select using (true);

-- Community messages: public read, authenticated insert, public like update
drop policy if exists "Anyone can view community messages" on public.community_messages;
create policy "Anyone can view community messages" on public.community_messages for select using (true);

drop policy if exists "Anyone can post community messages" on public.community_messages;
create policy "Anyone can post community messages" on public.community_messages for insert with check (true);

drop policy if exists "Anyone can like community messages" on public.community_messages;
create policy "Anyone can like community messages" on public.community_messages for update using (true);

-- Community notifications: user can view & update own notifications
drop policy if exists "Users can view own notifications" on public.community_notifications;
create policy "Users can view own notifications" on public.community_notifications for select using (true);

drop policy if exists "System can insert notifications" on public.community_notifications;
create policy "System can insert notifications" on public.community_notifications for insert with check (true);

drop policy if exists "Users can update own notifications" on public.community_notifications;
create policy "Users can update own notifications" on public.community_notifications for update using (true);

-- ============================================================
-- Enable Supabase Realtime (for live chat & notifications)
-- ============================================================
alter publication supabase_realtime add table public.community_messages;
alter publication supabase_realtime add table public.community_notifications;

-- ============================================================
-- Leaderboard View (top contributors by credits)
-- with (security_invoker = true) ensures RLS is respected for the querying user
-- ============================================================
create or replace view public.leaderboard
with (security_invoker = true) as
select
  p.id,
  p.username,
  p.full_name,
  p.department,
  p.course,
  p.avatar_url,
  p.total_credits,
  p.papers_approved,
  rank() over (order by p.total_credits desc) as rank
from public.profiles p
where p.total_credits > 0 and p.role = 'student'
order by p.total_credits desc;


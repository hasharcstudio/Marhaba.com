-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users / Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null default '',
  gender text check (gender in ('male', 'female', 'other')),
  birthdate date,
  bio text,
  profession text,
  location text,
  latitude double precision,
  longitude double precision,
  photos text[] default '{}',
  prompt_question text,
  prompt_answer text,
  is_verified boolean default false,
  is_blur_default boolean default true,
  is_onboarded boolean default false,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User Preferences
create table public.preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  min_age int default 18,
  max_age int default 40,
  preferred_gender text check (preferred_gender in ('male', 'female', 'other')),
  preferred_religion text,
  preferred_location text,
  max_distance_km int default 50,
  preferred_education text,
  created_at timestamptz default now()
);

-- Swipes
create table public.swipes (
  id uuid default uuid_generate_v4() primary key,
  swiper_id uuid references public.profiles(id) on delete cascade not null,
  swiped_id uuid references public.profiles(id) on delete cascade not null,
  direction text check (direction in ('like', 'pass')) not null,
  created_at timestamptz default now(),
  unique(swiper_id, swiped_id)
);

-- Matches
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  user_a_id uuid references public.profiles(id) on delete cascade not null,
  user_b_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_a_id, user_b_id)
);

-- Messages
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Reports
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  reported_id uuid references public.profiles(id) on delete cascade not null,
  reason text check (reason in ('harassment', 'spam', 'fake_profile', 'inappropriate_content', 'other')) not null,
  details text,
  status text default 'pending' check (status in ('pending', 'reviewed', 'resolved')),
  created_at timestamptz default now()
);

-- Blocked Users
create table public.blocked_users (
  id uuid default uuid_generate_v4() primary key,
  blocker_id uuid references public.profiles(id) on delete cascade not null,
  blocked_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.preferences enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
alter table public.blocked_users enable row level security;

-- RLS Policies: Users can read all profiles but only edit their own
create policy "Profiles are viewable by authenticated users" on public.profiles for select using (auth.role() = 'authenticated');
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Preferences: Users can only access their own
create policy "Users can view own preferences" on public.preferences for select using (auth.uid() = user_id);
create policy "Users can update own preferences" on public.preferences for update using (auth.uid() = user_id);
create policy "Users can insert own preferences" on public.preferences for insert with check (auth.uid() = user_id);

-- Swipes: Users can create and view their own swipes
create policy "Users can create swipes" on public.swipes for insert with check (auth.uid() = swiper_id);
create policy "Users can view own swipes" on public.swipes for select using (auth.uid() = swiper_id);

-- Matches: Users can view their own matches
create policy "Users can view own matches" on public.matches for select using (auth.uid() = user_a_id or auth.uid() = user_b_id);
create policy "System can create matches" on public.matches for insert with check (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- Messages: Users can read/write messages in their matches
create policy "Users can view messages in own matches" on public.messages for select using (
  exists (select 1 from public.matches where id = match_id and (user_a_id = auth.uid() or user_b_id = auth.uid()))
);
create policy "Users can send messages in own matches" on public.messages for insert with check (
  auth.uid() = sender_id and
  exists (select 1 from public.matches where id = match_id and (user_a_id = auth.uid() or user_b_id = auth.uid()))
);

-- Enable Realtime for messages
alter publication supabase_realtime add table public.messages;

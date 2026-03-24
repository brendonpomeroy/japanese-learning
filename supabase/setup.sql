-- ============================================================
-- Supabase setup for Japanese Lessons cloud backup
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Create the user_data table
create table if not exists user_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  key text not null,
  data jsonb not null,
  updated_at timestamptz default now() not null,
  unique (user_id, key)
);

-- 2. Enable Row Level Security
alter table user_data enable row level security;

-- 3. RLS policy: users can only CRUD their own rows
create policy "Users CRUD own data"
on user_data
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

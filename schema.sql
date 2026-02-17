-- Create a table for public profiles using Supabase Auth
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Links table
create table if not exists public.links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  url text not null,
  title text,
  description text,
  summary text,
  site_name text,
  image_url text,
  type text check (type in ('article', 'video', 'website')),
  reading_time integer,
  status text check (status in ('unread', 'archived')) default 'unread',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for links
alter table public.links enable row level security;

create policy "Users can view their own links." on public.links
  for select using (auth.uid() = user_id);

create policy "Users can create their own links." on public.links
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own links." on public.links
  for update using (auth.uid() = user_id);

create policy "Users can delete their own links." on public.links
  for delete using (auth.uid() = user_id);


# Copytology Database Schema

## Users/Profiles Table (already implemented)
Extends Supabase auth.users with profile information

```sql
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  current_xp integer default 0,
  level_id integer default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  primary key (id)
);

-- Trigger to update profiles when a user is created
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Levels Table
Defines the progression system

```sql
create table public.levels (
  id serial primary key,
  title text not null,
  required_xp integer not null,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Insert default levels
insert into public.levels (title, required_xp, description) values
('Intern', 0, 'Just starting your copywriting journey'),
('Trainee', 1000, 'Learning the basics of copywriting'),
('Junior Associate', 3000, 'Building your core writing skills'),
('Associate', 5000, 'Developing your own writing style'),
('Senior Associate', 10000, 'Confidently handling various writing assignments'),
('Team Lead', 15000, 'Starting to guide others in copywriting'),
('Manager', 25000, 'Managing content strategy and teams'),
('Director', 40000, 'Leading content initiatives across channels'),
('VP', 60000, 'Executive-level content strategy'),
('CMO', 100000, 'Chief Marketing Officer - mastery of all aspects');
```

## Challenges Table
Stores all writing challenges

```sql
create table public.challenges (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('copywriting', 'content', 'uxwriting')),
  title text not null,
  description text not null,
  brief text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  time_estimate text,
  guidelines text[] not null,
  word_limit integer not null,
  example_prompt text,
  min_level_id integer references public.levels(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies for challenges
alter table public.challenges enable row level security;

create policy "Challenges are visible to all authenticated users"
  on public.challenges
  for select
  to authenticated
  using (true);
```

## User Challenges Table
Maps challenges to users

```sql
create table public.user_challenges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  status text not null check (status in ('active', 'completed', 'skipped')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(user_id, challenge_id)
);

-- Add RLS policies for user_challenges
alter table public.user_challenges enable row level security;

create policy "Users can view their own challenges"
  on public.user_challenges
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own challenges"
  on public.user_challenges
  for update
  to authenticated
  using (auth.uid() = user_id);
```

## Submissions Table
Stores user responses to challenges

```sql
create table public.submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  response text not null,
  score integer not null,
  feedback text[] not null,
  improvement_tip text,
  xp_gained integer not null,
  created_at timestamp with time zone default now(),
  
  unique(user_id, challenge_id, created_at)
);

-- Add RLS policies for submissions
alter table public.submissions enable row level security;

create policy "Users can view their own submissions"
  on public.submissions
  for select
  to authenticated
  using (auth.uid() = user_id);
```

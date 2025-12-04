-- Create Users table (extending default auth.users if needed, or just a public profile table)
-- Note: Supabase handles auth in auth.users. We usually create a public.users table for extra profile data.
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  role text check (role in ('admin', 'consultant')),
  branch text,
  phone text
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policies (simplified for demo)
create policy "Public profiles are viewable by everyone" on public.users for select using (true);
create policy "Users can insert their own profile" on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Create Orders table
create table public.orders (
  id text primary key, -- Keeping text as per mock 'PEDIDO-001', but uuid is better for real apps
  "dateRequest" date,
  status text check (status in ('Pending', 'Approved', 'Rejected', 'Scheduled')),
  branch text,
  "consultantId" text, -- If linking to public.users, use uuid references public.users(id)
  "consultantName" text,
  client text,
  volume numeric,
  "pumpType" text,
  "concreteDate" date,
  notes text
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policies for Orders
-- Admin can do everything
-- Consultants can view/create their own
create policy "Admins can do everything" on public.orders
  for all using (
    exists (
      select 1 from public.users
      where public.users.id = auth.uid() and public.users.role = 'admin'
    )
  );

create policy "Consultants can view own orders" on public.orders
  for select using (
    "consultantId" = auth.uid()::text
  );

create policy "Consultants can insert own orders" on public.orders
  for insert with check (
    "consultantId" = auth.uid()::text
  );

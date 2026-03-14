-- TradeFlow Pro schema
create extension if not exists "pgcrypto";

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  full_name text,
  email text unique not null,
  role text not null check (role in ('admin', 'buyer', 'supplier', 'ops')),
  created_at timestamptz not null default now()
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  owner_user_id uuid references users(id) on delete set null,
  name text not null,
  contact_email text not null,
  risk_tier text not null default 'medium' check (risk_tier in ('low', 'medium', 'high')),
  kyc_status text not null default 'pending' check (kyc_status in ('pending', 'submitted', 'verified', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists buyers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  owner_user_id uuid references users(id) on delete set null,
  name text not null,
  contact_email text not null,
  credit_limit numeric(14, 2) default 0,
  created_at timestamptz not null default now()
);

create table if not exists purchase_orders (
  id uuid primary key default gen_random_uuid(),
  po_number text unique not null,
  buyer_id uuid not null,
  supplier_id uuid not null references suppliers(id) on delete cascade,
  amount numeric(14, 2) not null,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'approved', 'fulfilled')),
  expected_delivery date,
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  buyer_id uuid not null,
  supplier_id uuid not null references suppliers(id) on delete cascade,
  purchase_order_id uuid references purchase_orders(id) on delete set null,
  amount numeric(14, 2) not null,
  status text not null default 'draft' check (status in ('draft', 'pending', 'approved', 'paid', 'overdue')),
  issued_at timestamptz not null default now(),
  due_date date not null,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  payer_id uuid not null,
  amount numeric(14, 2) not null,
  status text not null default 'initiated' check (status in ('initiated', 'settled', 'failed')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists financing_requests (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null,
  invoice_id uuid not null references invoices(id) on delete cascade,
  requested_amount numeric(14, 2) not null,
  discount_rate numeric(5, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null,
  supplier_id uuid references suppliers(id) on delete set null,
  document_type text not null,
  file_url text not null,
  status text not null default 'submitted' check (status in ('submitted', 'verified', 'rejected')),
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table organizations enable row level security;
alter table users enable row level security;
alter table suppliers enable row level security;
alter table buyers enable row level security;
alter table purchase_orders enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;
alter table financing_requests enable row level security;
alter table documents enable row level security;
alter table audit_logs enable row level security;
alter table notifications enable row level security;

create policy if not exists "Users can read own row"
  on users for select
  using (auth.uid() = id);

create policy if not exists "Users can read suppliers"
  on suppliers for select
  using (true);

create policy if not exists "Users can read buyers"
  on buyers for select
  using (true);

create policy if not exists "Users can read invoices"
  on invoices for select
  using (true);

create policy if not exists "Users can insert invoices"
  on invoices for insert
  with check (auth.uid() = buyer_id);

create policy if not exists "Users can update invoices"
  on invoices for update
  using (true);

create policy if not exists "Users can read purchase orders"
  on purchase_orders for select
  using (true);

create policy if not exists "Users can insert purchase orders"
  on purchase_orders for insert
  with check (auth.uid() = buyer_id);

create policy if not exists "Users can read financing requests"
  on financing_requests for select
  using (true);

create policy if not exists "Suppliers can create financing requests"
  on financing_requests for insert
  with check (auth.uid() = supplier_id);

create policy if not exists "Users can insert documents"
  on documents for insert
  with check (auth.uid() = uploaded_by);

create policy if not exists "Users can read notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert notifications"
  on notifications for insert
  with check (auth.uid() = user_id);

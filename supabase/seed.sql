-- Seed data for TradeFlow Pro using generated UUIDs
begin;

create temp table tmp_org (
  id uuid primary key
) on commit drop;

create temp table tmp_suppliers (
  seq int primary key,
  id uuid not null
) on commit drop;

create temp table tmp_pos (
  seq int primary key,
  id uuid not null,
  supplier_id uuid not null
) on commit drop;

create temp table tmp_invoices (
  seq int primary key,
  id uuid not null,
  supplier_id uuid not null,
  amount numeric(14, 2) not null
) on commit drop;

insert into tmp_org (id)
select gen_random_uuid();

insert into organizations (id, name, industry, country)
select id, 'TradeFlow Demo Org', 'Manufacturing', 'United States'
from tmp_org;

insert into buyers (id, organization_id, name, contact_email, credit_limit)
select gen_random_uuid(), o.id, 'Prime Retail Buyer', 'buyer@tradeflowpro.com', 5000000
from tmp_org o;

insert into tmp_suppliers (seq, id)
select gs, gen_random_uuid()
from generate_series(1, 10) as gs;

insert into suppliers (id, organization_id, name, contact_email, risk_tier)
select
  s.id,
  o.id,
  format('Supplier %s', s.seq),
  format('supplier%s@tradeflowpro.com', s.seq),
  (array['low', 'medium', 'high'])[(s.seq % 3) + 1]
from tmp_suppliers s
cross join tmp_org o;

insert into tmp_pos (seq, id, supplier_id)
select
  gs,
  gen_random_uuid(),
  (select id from tmp_suppliers where seq = ((gs - 1) % 10 + 1))
from generate_series(1, 5) as gs;

insert into purchase_orders (
  id,
  po_number,
  buyer_id,
  supplier_id,
  amount,
  status,
  expected_delivery
)
select
  p.id,
  format('PO-%s-%s', replace(substring(o.id::text, 1, 8), '-', ''), p.seq),
  b.id,
  p.supplier_id,
  (45000 + p.seq * 8500)::numeric,
  (array['submitted', 'approved', 'fulfilled'])[(p.seq % 3) + 1],
  (current_date + (p.seq * 3))::date
from tmp_pos p
cross join tmp_org o
cross join lateral (
  select id from buyers order by created_at desc limit 1
) b;

insert into tmp_invoices (seq, id, supplier_id, amount)
select
  gs,
  gen_random_uuid(),
  (select id from tmp_suppliers where seq = ((gs - 1) % 10 + 1)),
  (25000 + gs * 6000)::numeric
from generate_series(1, 20) as gs;

insert into invoices (
  id,
  invoice_number,
  buyer_id,
  supplier_id,
  purchase_order_id,
  amount,
  status,
  issued_at,
  due_date,
  approved_at,
  paid_at
)
select
  i.id,
  format('INV-%s-%s', replace(substring(o.id::text, 1, 8), '-', ''), i.seq),
  b.id,
  i.supplier_id,
  case
    when i.seq <= 5 then (select id from tmp_pos where seq = i.seq)
    else null
  end,
  i.amount,
  (array['pending', 'approved', 'paid', 'overdue'])[(i.seq % 4) + 1],
  (now() - ((20 - i.seq) || ' days')::interval),
  (current_date + ((i.seq % 12) + 10))::date,
  case
    when i.seq % 4 in (2, 3) then now() - ((10 - (i.seq % 8)) || ' days')::interval
    else null
  end,
  case
    when i.seq % 4 = 3 then now() - ((5 - (i.seq % 4)) || ' days')::interval
    else null
  end
from tmp_invoices i
cross join tmp_org o
cross join lateral (
  select id from buyers order by created_at desc limit 1
) b;

insert into financing_requests (
  id,
  supplier_id,
  invoice_id,
  requested_amount,
  discount_rate,
  status,
  requested_at
)
select
  gen_random_uuid(),
  i.supplier_id,
  i.id,
  i.amount * 0.8,
  round((1.2 + (random() * 1.8))::numeric, 2),
  (array['pending', 'approved', 'rejected'])[(row_number() over (order by i.seq) % 3) + 1],
  now() - ((row_number() over (order by i.seq)) || ' days')::interval
from tmp_invoices i
order by i.seq
limit 8;

commit;

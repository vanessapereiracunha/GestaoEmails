-- Database schema for the app
create extension if not exists pgcrypto;

create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  remetente text not null,
  destinatario text not null,
  assunto text,
  corpo text,
  dataHora timestamptz not null default now(),
  uf text,
  municipio text,
  classificado boolean not null default false
);

create index if not exists idx_emails_classificado on public.emails(classificado);
create index if not exists idx_emails_datahora on public.emails(dataHora desc);
-- Optional: natural uniqueness to avoid duplicates from ingestion strategies
-- create unique index if not exists uniq_emails_natural
--   on public.emails(remetente, destinatario, coalesce(assunto, ''), dataHora);

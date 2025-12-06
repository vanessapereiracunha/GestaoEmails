-- Database schema for the app
create extension if not exists pgcrypto;

-- Tabela de unidades federativas (UFs)
create table if not exists public.ufs (
  sigla char(2) primary key,
  nome  text    not null
);

-- Tabela de municípios, vinculados a uma UF
create table if not exists public.municipios (
  id       bigserial primary key,
  nome     text      not null,
  uf_sigla char(2)   not null references public.ufs(sigla)
);

-- Tabela principal de e-mails
create table if not exists public.emails (
  id uuid primary key default gen_random_uuid(),
  remetente text not null,
  destinatario text not null,
  assunto text,
  corpo text,
  "dataHora" timestamptz not null default now(),
  -- colunas text simples usadas atualmente pela aplicação
  uf text,
  municipio text,
  -- colunas normalizadas opcionais (para uso futuro / queries mais ricas)
  uf_sigla char(2) references public.ufs(sigla),
  municipio_id bigint references public.municipios(id),
  classificado boolean not null default false
);

create index if not exists idx_emails_classificado on public.emails(classificado);
create index if not exists idx_emails_datahora on public.emails("dataHora" desc);
create index if not exists idx_emails_uf_sigla on public.emails(uf_sigla);
create index if not exists idx_emails_municipio_id on public.emails(municipio_id);
-- Optional: natural uniqueness to avoid duplicates from ingestion strategies
-- create unique index if not exists uniq_emails_natural
--   on public.emails(remetente, destinatario, coalesce(assunto, ''), dataHora);

-- ---------------------------------------------------------------------------
-- Usuários de aplicação (tabela public.users) e perfis (auth.users -> public.profiles)
-- ---------------------------------------------------------------------------

-- Tabela de usuários de aplicação (independente de auth.users)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nome text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabela de perfis vinculada ao auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nome text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Relacionar emails a um colaborador (opcional)
alter table public.emails
  add column if not exists colaborador_id uuid
    references public.profiles(id) on delete set null;

-- Função genérica para manter updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Garantir coluna updated_at em emails (caso ainda não exista)
alter table public.emails
  add column if not exists updated_at timestamptz not null default now();

-- Trigger de updated_at em users, profiles e emails
create trigger if not exists update_users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at_column();

create trigger if not exists update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger if not exists update_emails_updated_at
  before update on public.emails
  for each row execute function public.update_updated_at_column();

-- Função para criar profile automaticamente no signup do Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nome)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger no auth.users para criar profile
create trigger if not exists on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

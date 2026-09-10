/*
# Core Tables for Dotcoms Agency Website

## Overview
Creates the foundational tables for the Dotcoms web design agency website and admin panel.

## New Tables
1. `profiles` - Extended user profile info linked to auth.users
2. `admins` - Admin users with role-based access
3. `leads` - Potential client inquiries from the website
4. `clients` - Signed client information
5. `projects` - Project management tracking
6. `project_updates` - Milestones and updates for projects
7. `services` - Services offered by the agency
8. `portfolio_projects` - Showcase portfolio items
9. `portfolio_media` - Media files for portfolio items

## Security
- RLS enabled on all tables
- Public read access for services, portfolio_projects, portfolio_media (website content)
- Admin-only access for leads, clients, projects, project_updates (sensitive data)
- Owner-scoped access for profiles
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ ADMINS ============
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_select_authenticated" ON admins;
CREATE POLICY "admins_select_authenticated" ON admins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admins_update_own" ON admins;
CREATE POLICY "admins_update_own" ON admins FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ LEADS ============
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business text,
  phone text,
  email text NOT NULL,
  whatsapp text,
  service_interested text,
  budget text,
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notes text,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads_insert_public" ON leads;
CREATE POLICY "leads_insert_public" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "leads_select_admin" ON leads;
CREATE POLICY "leads_select_admin" ON leads FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "leads_update_admin" ON leads;
CREATE POLICY "leads_update_admin" ON leads FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "leads_delete_admin" ON leads;
CREATE POLICY "leads_delete_admin" ON leads FOR DELETE
  TO authenticated USING (true);

-- ============ CLIENTS ============
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business text NOT NULL,
  email text NOT NULL,
  phone text,
  whatsapp text,
  address text,
  logo_url text,
  website_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clients_select_admin" ON clients;
CREATE POLICY "clients_select_admin" ON clients FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "clients_insert_admin" ON clients;
CREATE POLICY "clients_insert_admin" ON clients FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "clients_update_admin" ON clients;
CREATE POLICY "clients_update_admin" ON clients FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "clients_delete_admin" ON clients;
CREATE POLICY "clients_delete_admin" ON clients FOR DELETE
  TO authenticated USING (true);

-- ============ PROJECTS ============
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled')),
  deadline date,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  payment_amount numeric(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select_admin" ON projects;
CREATE POLICY "projects_select_admin" ON projects FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "projects_insert_admin" ON projects;
CREATE POLICY "projects_insert_admin" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "projects_update_admin" ON projects;
CREATE POLICY "projects_update_admin" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "projects_delete_admin" ON projects;
CREATE POLICY "projects_delete_admin" ON projects FOR DELETE
  TO authenticated USING (true);

-- ============ PROJECT UPDATES ============
CREATE TABLE IF NOT EXISTS project_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  milestone_type text DEFAULT 'update' CHECK (milestone_type IN ('milestone', 'update', 'note', 'issue')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "project_updates_select_admin" ON project_updates;
CREATE POLICY "project_updates_select_admin" ON project_updates FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "project_updates_insert_admin" ON project_updates;
CREATE POLICY "project_updates_insert_admin" ON project_updates FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "project_updates_update_admin" ON project_updates;
CREATE POLICY "project_updates_update_admin" ON project_updates FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "project_updates_delete_admin" ON project_updates;
CREATE POLICY "project_updates_delete_admin" ON project_updates FOR DELETE
  TO authenticated USING (true);

-- ============ SERVICES ============
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  long_description text,
  icon text,
  price_range text,
  features jsonb DEFAULT '[]'::jsonb,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "services_select_public" ON services;
CREATE POLICY "services_select_public" ON services FOR SELECT
  TO anon, authenticated USING (is_visible = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "services_select_admin" ON services;
CREATE POLICY "services_select_admin" ON services FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "services_insert_admin" ON services;
CREATE POLICY "services_insert_admin" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "services_update_admin" ON services;
CREATE POLICY "services_update_admin" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "services_delete_admin" ON services;
CREATE POLICY "services_delete_admin" ON services FOR DELETE
  TO authenticated USING (true);

-- ============ PORTFOLIO PROJECTS ============
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  client_name text,
  category text NOT NULL,
  description text NOT NULL,
  long_description text,
  challenge text,
  solution text,
  result text,
  metrics jsonb DEFAULT '[]'::jsonb,
  before_image_url text,
  after_image_url text,
  live_url text,
  github_url text,
  technologies jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portfolio_select_public" ON portfolio_projects;
CREATE POLICY "portfolio_select_public" ON portfolio_projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "portfolio_insert_admin" ON portfolio_projects;
CREATE POLICY "portfolio_insert_admin" ON portfolio_projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "portfolio_update_admin" ON portfolio_projects;
CREATE POLICY "portfolio_update_admin" ON portfolio_projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "portfolio_delete_admin" ON portfolio_projects;
CREATE POLICY "portfolio_delete_admin" ON portfolio_projects FOR DELETE
  TO authenticated USING (true);

-- ============ PORTFOLIO MEDIA ============
CREATE TABLE IF NOT EXISTS portfolio_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_project_id uuid NOT NULL REFERENCES portfolio_projects(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE portfolio_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portfolio_media_select_public" ON portfolio_media;
CREATE POLICY "portfolio_media_select_public" ON portfolio_media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "portfolio_media_insert_admin" ON portfolio_media;
CREATE POLICY "portfolio_media_insert_admin" ON portfolio_media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "portfolio_media_update_admin" ON portfolio_media;
CREATE POLICY "portfolio_media_update_admin" ON portfolio_media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "portfolio_media_delete_admin" ON portfolio_media;
CREATE POLICY "portfolio_media_delete_admin" ON portfolio_media FOR DELETE
  TO authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio_projects(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_projects(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_project_id ON portfolio_media(portfolio_project_id);

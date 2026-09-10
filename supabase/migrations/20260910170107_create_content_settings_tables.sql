/*
# Content & Settings Tables for Dotcoms Agency Website

## Overview
Creates tables for content management, testimonials, blog, media, settings, analytics, and notifications.

## New Tables
1. `testimonials` - Client testimonials with ratings
2. `blog_posts` - Blog articles with SEO fields
3. `blog_categories` - Blog category taxonomy
4. `media` - Media library for uploaded files
5. `contact_messages` - Messages from contact form
6. `newsletter` - Newsletter subscribers
7. `website_settings` - Global site configuration
8. `seo_settings` - SEO metadata per page
9. `analytics` - Website visit tracking
10. `activity_logs` - Admin activity audit trail
11. `notifications` - Admin notifications
12. `team_members` - Team member profiles
13. `faq` - Frequently asked questions

## Security
- RLS enabled on all tables
- Public read for testimonials, blog_posts, blog_categories, website_settings, seo_settings, team_members, faq
- Public insert for contact_messages, newsletter
- Admin-only for media, analytics, activity_logs, notifications
*/

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  business text,
  photo_url text,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review text NOT NULL,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_select_public" ON testimonials;
CREATE POLICY "testimonials_select_public" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "testimonials_insert_admin" ON testimonials;
CREATE POLICY "testimonials_insert_admin" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "testimonials_update_admin" ON testimonials;
CREATE POLICY "testimonials_update_admin" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "testimonials_delete_admin" ON testimonials;
CREATE POLICY "testimonials_delete_admin" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- ============ BLOG CATEGORIES ============
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_categories_select_public" ON blog_categories;
CREATE POLICY "blog_categories_select_public" ON blog_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "blog_categories_insert_admin" ON blog_categories;
CREATE POLICY "blog_categories_insert_admin" ON blog_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "blog_categories_update_admin" ON blog_categories;
CREATE POLICY "blog_categories_update_admin" ON blog_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "blog_categories_delete_admin" ON blog_categories;
CREATE POLICY "blog_categories_delete_admin" ON blog_categories FOR DELETE
  TO authenticated USING (true);

-- ============ BLOG POSTS ============
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags jsonb DEFAULT '[]'::jsonb,
  featured_image_url text,
  meta_title text,
  meta_description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  author_name text DEFAULT 'Dotcoms',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blog_posts_select_public" ON blog_posts;
CREATE POLICY "blog_posts_select_public" ON blog_posts FOR SELECT
  TO anon, authenticated USING (status = 'published' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "blog_posts_insert_admin" ON blog_posts;
CREATE POLICY "blog_posts_insert_admin" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "blog_posts_update_admin" ON blog_posts;
CREATE POLICY "blog_posts_update_admin" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "blog_posts_delete_admin" ON blog_posts;
CREATE POLICY "blog_posts_delete_admin" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- ============ MEDIA ============
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'image' CHECK (file_type IN ('image', 'video', 'document')),
  file_size bigint DEFAULT 0,
  folder text DEFAULT 'root',
  mime_type text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "media_select_admin" ON media;
CREATE POLICY "media_select_admin" ON media FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "media_insert_admin" ON media;
CREATE POLICY "media_insert_admin" ON media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "media_update_admin" ON media;
CREATE POLICY "media_update_admin" ON media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "media_delete_admin" ON media;
CREATE POLICY "media_delete_admin" ON media FOR DELETE
  TO authenticated USING (true);

-- ============ CONTACT MESSAGES ============
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contact_messages_insert_public" ON contact_messages;
CREATE POLICY "contact_messages_insert_public" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "contact_messages_select_admin" ON contact_messages;
CREATE POLICY "contact_messages_select_admin" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "contact_messages_update_admin" ON contact_messages;
CREATE POLICY "contact_messages_update_admin" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "contact_messages_delete_admin" ON contact_messages;
CREATE POLICY "contact_messages_delete_admin" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- ============ NEWSLETTER ============
CREATE TABLE IF NOT EXISTS newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now()
);
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter_insert_public" ON newsletter;
CREATE POLICY "newsletter_insert_public" ON newsletter FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "newsletter_select_admin" ON newsletter;
CREATE POLICY "newsletter_select_admin" ON newsletter FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "newsletter_delete_admin" ON newsletter;
CREATE POLICY "newsletter_delete_admin" ON newsletter FOR DELETE
  TO authenticated USING (true);

-- ============ WEBSITE SETTINGS ============
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
  company_name text DEFAULT 'Dotcoms',
  company_tagline text DEFAULT 'Websites That Grow Businesses',
  logo_url text,
  favicon_url text,
  primary_color text DEFAULT '#2563eb',
  accent_color text DEFAULT '#3b82f6',
  contact_email text DEFAULT 'hello@dotcoms.com',
  contact_phone text,
  whatsapp_number text,
  address text,
  facebook_url text,
  twitter_url text,
  instagram_url text,
  linkedin_url text,
  google_analytics_id text,
  meta_title text DEFAULT 'Dotcoms - Web Design Agency',
  meta_description text DEFAULT 'We design high-converting business websites that help companies earn more customers.',
  hero_headline text DEFAULT 'Websites That Grow Businesses.',
  hero_subheadline text DEFAULT 'We design high-converting business websites that help companies earn more customers.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid)
);
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "website_settings_select_public" ON website_settings;
CREATE POLICY "website_settings_select_public" ON website_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "website_settings_update_admin" ON website_settings;
CREATE POLICY "website_settings_update_admin" ON website_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============ SEO SETTINGS ============
CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  og_image_url text,
  keywords jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seo_settings_select_public" ON seo_settings;
CREATE POLICY "seo_settings_select_public" ON seo_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "seo_settings_insert_admin" ON seo_settings;
CREATE POLICY "seo_settings_insert_admin" ON seo_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "seo_settings_update_admin" ON seo_settings;
CREATE POLICY "seo_settings_update_admin" ON seo_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seo_settings_delete_admin" ON seo_settings;
CREATE POLICY "seo_settings_delete_admin" ON seo_settings FOR DELETE
  TO authenticated USING (true);

-- ============ ANALYTICS ============
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  visitor_ip text,
  user_agent text,
  referrer text,
  session_id text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analytics_insert_public" ON analytics;
CREATE POLICY "analytics_insert_public" ON analytics FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "analytics_select_admin" ON analytics;
CREATE POLICY "analytics_select_admin" ON analytics FOR SELECT
  TO authenticated USING (true);

-- ============ ACTIVITY LOGS ============
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_logs_select_admin" ON activity_logs;
CREATE POLICY "activity_logs_select_admin" ON activity_logs FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "activity_logs_insert_admin" ON activity_logs;
CREATE POLICY "activity_logs_insert_admin" ON activity_logs FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('lead', 'message', 'project', 'system', 'blog')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_admin" ON notifications;
CREATE POLICY "notifications_select_admin" ON notifications FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "notifications_update_admin" ON notifications;
CREATE POLICY "notifications_update_admin" ON notifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "notifications_delete_admin" ON notifications;
CREATE POLICY "notifications_delete_admin" ON notifications FOR DELETE
  TO authenticated USING (true);

-- ============ TEAM MEMBERS ============
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  photo_url text,
  linkedin_url text,
  twitter_url text,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "team_members_select_public" ON team_members;
CREATE POLICY "team_members_select_public" ON team_members FOR SELECT
  TO anon, authenticated USING (is_visible = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "team_members_insert_admin" ON team_members;
CREATE POLICY "team_members_insert_admin" ON team_members FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "team_members_update_admin" ON team_members;
CREATE POLICY "team_members_update_admin" ON team_members FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "team_members_delete_admin" ON team_members;
CREATE POLICY "team_members_delete_admin" ON team_members FOR DELETE
  TO authenticated USING (true);

-- ============ FAQ ============
CREATE TABLE IF NOT EXISTS faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "faq_select_public" ON faq;
CREATE POLICY "faq_select_public" ON faq FOR SELECT
  TO anon, authenticated USING (is_visible = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "faq_insert_admin" ON faq;
CREATE POLICY "faq_insert_admin" ON faq FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "faq_update_admin" ON faq;
CREATE POLICY "faq_update_admin" ON faq FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "faq_delete_admin" ON faq;
CREATE POLICY "faq_delete_admin" ON faq FOR DELETE
  TO authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faq_display_order ON faq(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);

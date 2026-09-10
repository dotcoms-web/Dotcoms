/*
# Storage Policies for Media Bucket

## Overview
Creates storage bucket policies for the public 'media' bucket used for portfolio images, testimonials photos, blog images, and other media uploads.

## Security
- Public read access for all media (images are shown on the public website)
- Authenticated users can upload, update, and delete media
*/

DROP POLICY IF EXISTS "media_bucket_read" ON storage.objects;
CREATE POLICY "media_bucket_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_bucket_insert" ON storage.objects;
CREATE POLICY "media_bucket_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_bucket_update" ON storage.objects;
CREATE POLICY "media_bucket_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_bucket_delete" ON storage.objects;
CREATE POLICY "media_bucket_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');

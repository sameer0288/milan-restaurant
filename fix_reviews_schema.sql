-- Run this SQL in your Supabase SQL Editor to fix the "Missing column" error

-- 1. Add the owner_response column to the reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS owner_response TEXT;

-- 2. (Optional) Ensure is_approved exists and defaults to false if not already set
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- 3. (Optional) Add source column if missing (for "Google" vs "Website" distinction)
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Website';

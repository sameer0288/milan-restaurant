-- Add order column to gallery table for Home Showcase feature
ALTER TABLE gallery ADD COLUMN showcase_order INTEGER DEFAULT NULL;

-- Optional: Add index for faster ordering
CREATE INDEX idx_gallery_showcase_order ON gallery(showcase_order);

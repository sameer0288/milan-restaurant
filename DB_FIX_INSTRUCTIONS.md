# 🚨 CRITICAL: How to Fix "Missing Column" Error

The error `Could not find the 'owner_response' column` means your database **does not have the field** to save replies yet. I cannot fix this from the code alone; you must run a command in your Supabase database.

### Step 1: Login to Supabase
Go to your [Supabase Dashboard](https://supabase.com/dashboard).

### Step 2: Open SQL Editor
Click on the **SQL Editor** icon (customarily on the left sidebar, looks like a terminal `>_`).

### Step 3: Run this Script
Copy the code below, paste it into the SQL Editor, and click the **RUN** button (bottom right).

```sql
-- RELOAD SCHEMA CACHE (Just in case)
NOTIFY pgrst, 'reload config';

-- 1. Add the missing column for replies
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS owner_response TEXT;

-- 2. Add the missing column for approval status
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- 3. Add source column for Google/Website distinction
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Website';
```

### Step 4: Verify
1. Go back to your website admin panel.
2. Refresh the page.
3. Try to reply to a review again.

> **Why did this happen?**
> We added new features (Replies, Approvals) in the code, but the database is separate and needs to be told about these new storage fields.

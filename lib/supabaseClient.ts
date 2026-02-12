import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
    console.warn("Supabase URL or Key is missing. Check your .env.local file. Using placeholder values.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

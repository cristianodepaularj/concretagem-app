import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sgdyhdhoflsxfimrxwdk.supabase.co';
const supabaseKey = 'sb_publishable_iF9niYRYEooVOubxr8zxyg_tUXw0HS6';

export const supabase = createClient(supabaseUrl, supabaseKey);

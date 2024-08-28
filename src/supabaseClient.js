import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gicoawkbnernvoczzvaa.supabase.co'; // Replace with your Supabase API URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpY29hd2tibmVybnZvY3p6dmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ3NDgxNTksImV4cCI6MjA0MDMyNDE1OX0.eblzfZFNxDH9bTFc6ziHZSpPSvzXHN1Y0OwBUT8lWms';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

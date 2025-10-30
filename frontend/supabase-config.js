// Supabase Configuration
const SUPABASE_URL = 'https://nbrmmgtdapskhuyckqpk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5icm1tZ3RkYXBza2h1eWNrcXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MDYxNzQsImV4cCI6MjA3NzM4MjE3NH0.AeKQqJIf3vgb0Gkg1SQ8PYVOnhf8NMzQ0rapNUAKicI';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

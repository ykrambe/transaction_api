import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://foioyarrkccnvlasgimb.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaW95YXJya2NjbnZsYXNnaW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwODk4NTEsImV4cCI6MjAzOTY2NTg1MX0.mnB55FKfHMELc7K6tpKuwHqFztdtmZYdtoEO7hJ4AeU"

export const supabase = createClient(supabaseUrl, supabaseKey);

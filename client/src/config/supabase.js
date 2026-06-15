import { createClient } from '@supabase/supabase-js'

// Handle both Node.js and browser environments
let supabaseUrl, supabaseAnonKey

const getSupabaseKey = (env) =>
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY

if (typeof process !== 'undefined' && process.env) {
  // Node.js environment
  supabaseUrl = process.env.VITE_SUPABASE_URL
  supabaseAnonKey = getSupabaseKey(process.env)
  console.log('Environment: Node.js')
} else if (typeof import.meta !== 'undefined' && import.meta.env) {
  // Browser environment (Vite)
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  supabaseAnonKey = getSupabaseKey(import.meta.env)
  console.log('Environment: Browser')
}

// Debug logging
console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET')
console.log('Supabase Anon Key:', supabaseAnonKey ? 'SET' : 'NOT SET')

// Check if we have the required values
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
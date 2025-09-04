import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the current file's directory and find the client root
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const clientRoot = join(__dirname, '../../') // Go up from src/test/ to client/

// Load environment variables FIRST with explicit path
dotenv.config({ path: join(clientRoot, '.env') })

console.log('Loading .env from:', join(clientRoot, '.env'))
console.log('Environment variables loaded:')
console.log('- VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET')
console.log('- VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')

// Then import your config (this will now have access to process.env)
import { supabase } from '../config/supabase.js'

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...')
    console.log('Environment variables:')
    console.log('- VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET')
    console.log('- VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
    // Test basic connection
    const { data, error } = await supabase.from('_dummy_table_').select('*').limit(1)
    
    if (error && error.code === 'PGRST116') {
      console.log('✅ Supabase connection successful! (Expected error for non-existent table)')
    } else {
      console.log('✅ Supabase connection successful!')
    }
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
  }
}

testSupabase()
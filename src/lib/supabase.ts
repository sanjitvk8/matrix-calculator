import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

export type User = {
  id: string
  email?: string
  created_at: string
}

export type CalculationHistory = {
  id: string
  user_id: string
  operation: string
  matrices: any[]
  result: any
  mode: 'learn' | 'calc'
  created_at: string
}
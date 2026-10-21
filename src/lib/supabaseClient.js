import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://epnchivyhadenqskctck.supabase.co'
const supabaseAnonKey = 'sb_publishable_fe-fxkd955KM9dchFIxBYw_G0jM42DU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
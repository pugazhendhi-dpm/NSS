import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rqvunxmsbtpavhlsckux.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdnVueG1zYnRwYXZobHNja3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMDg1NTUsImV4cCI6MjA4Mzg4NDU1NX0.qou83_ga1ad5WzbkRmivSUGfB22cpBI5eqRDxqwkDXo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
    const { data, error } = await supabase
        .from('slider_events')
        .insert({
            title: 'Test',
            subtitle: 'Test',
            image_url: 'https://example.com/test.jpg',
            order_index: 0,
            created_by: 'Test'
        })
        .select()
        .single()
        
    console.log("Insert result:", { data, error })
}

testInsert()

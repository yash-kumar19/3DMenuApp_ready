// app/lib/supabase/service-role.ts
// Server-side Supabase client with service role key (bypasses RLS)
import { createClient } from '@supabase/supabase-js';

// Service role client for server-side operations (API routes)
// This bypasses Row Level Security policies
export const supabaseAdmin = (() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error('⚠️ Supabase credentials missing in service-role.ts');
        // Return a dummy client that will fail gracefully when used, or null
        // We use a placeholder so the module doesn't crash on import
        return createClient(url || 'https://placeholder.supabase.co', key || 'placeholder');
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
})();

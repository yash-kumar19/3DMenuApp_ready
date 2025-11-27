package config

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.storage.Storage

object SupabaseConfig {

    val client: SupabaseClient by lazy {
        createSupabaseClient(
            supabaseUrl = System.getenv("SUPABASE_URL"),
            supabaseKey = System.getenv("SUPABASE_SERVICE_ROLE_KEY") // safe on backend only
        ) {
            install(GoTrue)
            install(Postgrest)
            install(Storage)
        }
    }
}

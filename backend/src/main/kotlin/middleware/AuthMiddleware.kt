package middleware

import config.SupabaseConfig
import io.github.jan.supabase.gotrue.user.UserInfo
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*

suspend fun ApplicationCall.requireAuth(): UserInfo? {
    val token = request.headers["Authorization"]?.removePrefix("Bearer ")
        ?: return null

    return try {
        SupabaseConfig.client.gotrue.retrieveUser(token)
    } catch (e: Exception) {
        respond("Invalid auth token")
        null
    }
}

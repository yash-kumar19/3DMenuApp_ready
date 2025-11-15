package com.example.shared

import com.example.shared.models.Post
import io.ktor.client.*
import io.ktor.client.engine.cio.*     // ✅ CIO engine for JVM
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

actual class PostRepository {

    // ✅ Using CIO engine for JVM-based targets
    private val client = HttpClient(CIO)

    actual suspend fun fetchPosts(): List<Post> {
        return try {
            // ✅ This endpoint can be your backend’s REST API
            val response: HttpResponse = client.get("http://localhost:8080/posts")

            if (response.status == HttpStatusCode.OK) {
                // Deserialize JSON body into a list of Post objects
                response.body()
            } else {
                println("Server returned error: ${response.status}")
                emptyList()
            }

        } catch (e: Exception) {
            println("❌ Error fetching posts: ${e.message}")
            emptyList()
        }
    }
}

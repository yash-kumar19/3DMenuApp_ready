package com.example.shared

import com.example.shared.models.Post
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.call.body
import io.ktor.client.request.get

actual class PostRepository {
    private val client = HttpClient(CIO)
    actual suspend fun fetchPosts(): List<Post> {
        return client.get("https://jsonplaceholder.typicode.com/posts").body()
    }
}



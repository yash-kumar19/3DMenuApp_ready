package com.example.shared

import com.example.shared.models.Post
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.HttpClient

class PostRepository(private val client: HttpClient = ApiClient.client) {
    suspend fun fetchPosts(): List<Post> {
        return client.get("https://jsonplaceholder.typicode.com/posts").body()
    }
}

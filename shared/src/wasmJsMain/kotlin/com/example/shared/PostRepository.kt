package com.example.shared

import com.example.shared.models.Post

actual class PostRepository {
    actual suspend fun fetchPosts(): List<Post> {
        return listOf(
            Post(1, 1, "Web Example Post", "Hello from browser mock!")
        )
    }
}





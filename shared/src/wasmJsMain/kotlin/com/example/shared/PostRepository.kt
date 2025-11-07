package com.example.shared

import com.example.shared.models.Post

actual class PostRepository {
    actual suspend fun fetchPosts(): List<Post> = listOf(
        Post(userId = 1, id = 1, title = "Sample", body = "Web mock")
    )
}



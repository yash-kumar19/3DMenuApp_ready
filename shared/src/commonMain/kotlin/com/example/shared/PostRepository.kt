package com.example.shared

import com.example.shared.models.Post

expect class PostRepository () {
    suspend fun fetchPosts(): List<Post>
}

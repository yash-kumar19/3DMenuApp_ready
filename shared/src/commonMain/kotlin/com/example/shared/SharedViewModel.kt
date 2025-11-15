package com.example.shared

import com.example.shared.models.Post
import kotlinx.coroutines.*

class SharedViewModel {

    private val repo = PostRepository()

    suspend fun loadPosts(): List<Post> = repo.fetchPosts()
}

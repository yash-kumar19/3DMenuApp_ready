package com.example.shared

class SharedViewModel {
    private val repo = PostRepository()

    suspend fun loadPosts() = repo.fetchPosts()
}

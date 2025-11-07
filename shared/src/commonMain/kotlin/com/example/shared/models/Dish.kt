package com.example.shared.models



import kotlinx.serialization.Serializable

@Serializable
data class Dish(
    val id: Int,
    val name: String,
    val description: String,
    val imageUrl: String,
    val modelUrl: String? = null
)

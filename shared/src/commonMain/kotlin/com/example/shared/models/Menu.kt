package com.example.shared.models

import kotlinx.serialization.Serializable

@Serializable
data class Menu(
    val id: String,
    val name: String,
    val items: List<Dish>
)



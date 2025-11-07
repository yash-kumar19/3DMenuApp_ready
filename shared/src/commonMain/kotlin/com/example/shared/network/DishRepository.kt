package com.example.shared.network

import com.example.shared.models.Dish
import com.example.shared.models.Menu

// Expect declaration for platform-specific implementations
expect class DishRepository() {
    suspend fun getAllDishes(): List<Dish>
    suspend fun getMenu(menuId: String): Menu
    suspend fun addDish(dish: Dish): Dish
}

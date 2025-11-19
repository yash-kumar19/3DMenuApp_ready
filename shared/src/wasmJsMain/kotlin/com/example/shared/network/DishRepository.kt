package com.example.shared.network

import com.example.shared.models.Dish
import com.example.shared.models.Menu

actual class DishRepository {
    actual suspend fun getAllDishes(): List<Dish> = sampleDishes()

    actual suspend fun getMenu(menuId: String): Menu =
        Menu(id = menuId, name = "Sample Menu", items = sampleDishes())

    actual suspend fun addDish(dish: Dish): Dish = dish

    private fun sampleDishes(): List<Dish> = listOf(
        Dish(id = 1, name = "Margherita Pizza", description = "Classic pizza", imageUrl = "", modelUrl = null),
        Dish(id = 2, name = "Sushi Platter", description = "Assorted sushi", imageUrl = "", modelUrl = null),
        Dish(id = 3, name = "Chocolate Lava Cake", description = "Molten center", imageUrl = "", modelUrl = null)
    )
}








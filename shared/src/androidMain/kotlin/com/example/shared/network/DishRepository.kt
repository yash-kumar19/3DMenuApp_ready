package com.example.shared.network

import com.example.shared.models.Dish
import com.example.shared.models.Menu
import io.ktor.client.call.body
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.client.request.setBody

actual class DishRepository {

    private val client: HttpClient = HttpClient(OkHttp)
    private val baseUrl = "https://mockapi.io/your_endpoint"

    actual suspend fun getAllDishes(): List<Dish> =
        runCatching { client.get("$baseUrl/dishes").body<List<Dish>>() }
            .getOrElse { sampleDishes() }

    actual suspend fun getMenu(menuId: String): Menu =
        runCatching { client.get("$baseUrl/menus/$menuId").body<Menu>() }
            .getOrElse { Menu(id = menuId, name = "Sample Menu", items = sampleDishes()) }

    actual suspend fun addDish(dish: Dish): Dish =
        client.post("$baseUrl/dishes") {
            contentType(ContentType.Application.Json)
            setBody(dish)
        }.body()

    private fun sampleDishes(): List<Dish> = listOf(
        Dish(id = 1, name = "Margherita Pizza", description = "Classic pizza", imageUrl = "", modelUrl = null),
        Dish(id = 2, name = "Sushi Platter", description = "Assorted sushi", imageUrl = "", modelUrl = null),
        Dish(id = 3, name = "Chocolate Lava Cake", description = "Molten center", imageUrl = "", modelUrl = null)
    )
}



package models

import kotlinx.serialization.Serializable
import java.util.UUID

@Serializable
data class Dish(
    val id: String = UUID.randomUUID().toString(),
    val restaurant_id: String,
    val name: String,
    val description: String? = null,
    val price: Double,
    val category: String,
    val image_url: String? = null,
    val model_url: String? = null,
    val status: DishStatus = DishStatus.DRAFT
)

@Serializable
enum class DishStatus {
    DRAFT, PROCESSING, PUBLISHED
}

@file:OptIn(androidx.compose.ui.ExperimentalComposeUiApi::class)
import androidx.compose.runtime.*
import androidx.compose.ui.window.CanvasBasedWindow
import com.example.shared.models.Dish
import com.example.shared.ui.MenuScreenWeb

fun main() {
    CanvasBasedWindow("3D Menu Web") {
        // Simple in-memory list for the web prototype
        val dishes = remember {
            listOf(
                Dish(1, "Margherita Pizza", "Classic pizza", "", null),
                Dish(2, "Sushi Platter", "Assorted sushi", "", null),
                Dish(3, "Chocolate Lava Cake", "Molten center", "", null)
            )
        }
        MenuScreenWeb(dishes = dishes)
    }
}



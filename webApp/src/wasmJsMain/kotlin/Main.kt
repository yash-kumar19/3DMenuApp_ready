@file:OptIn(androidx.compose.ui.ExperimentalComposeUiApi::class)

package com.example.webapp

import androidx.compose.ui.window.CanvasBasedWindow
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.shared.models.Dish
import com.example.shared.ui.MenuScreenWeb
import kotlinx.browser.document

fun main() {
    println("🚀 App starting...")

    val canvas = document.getElementById("ComposeTarget")
    if (canvas == null) {
        println("❌ No canvas found with id 'ComposeTarget'")
        return
    }

    try {
        CanvasBasedWindow(canvasElementId = "ComposeTarget") {
            println("✅ Compose Window Initialized")

            val dishes = remember {
                listOf(
                    Dish(1, "Margherita Pizza", "Classic pizza with mozzarella and basil", "", null),
                    Dish(2, "Sushi Platter", "Assorted Japanese sushi selection", "", null),
                    Dish(3, "Chocolate Lava Cake", "Rich chocolate cake with molten center", "", null)
                )
            }

            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = Color(0xFFF5F5F5)) {
                    Column(
                        modifier = Modifier.fillMaxSize().padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            "Today's Menu",
                            style = MaterialTheme.typography.headlineSmall,
                            color = Color(0xFF222222)
                        )
                        Spacer(Modifier.height(12.dp))
                        MenuScreenWeb(dishes)
                    }
                }
            }
        }
    } catch (e: Throwable) {
        println("❌ Compose initialization failed: ${e.message}")
        e.printStackTrace()
    }
}

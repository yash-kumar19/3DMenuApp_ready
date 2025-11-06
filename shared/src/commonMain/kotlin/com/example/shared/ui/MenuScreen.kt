@file:OptIn(org.jetbrains.compose.resources.ExperimentalResourceApi::class)
package com.example.shared.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.CardDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import org.jetbrains.compose.resources.painterResource
// ✅ use multiplatform resources

@Composable
fun MenuScreen(onBack: () -> Unit = {}) {
    val dishes = listOf(
        "Pasta Alfredo",
        "Grilled Chicken",
        "Margherita Pizza",
        "Caesar Salad",
        "Sushi Platter",
        "Chocolate Lava Cake"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Today's Menu",
            style = MaterialTheme.typography.headlineSmall.copy(
                color = Color.Black,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn {
            items(dishes) { dish ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF2F2F2))
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(12.dp)
                    ) {
                        // Temporary placeholder until drawable resource is added under commonMain/resources/drawable/
                        androidx.compose.foundation.layout.Box(
                            modifier = Modifier
                                .size(64.dp)
                                .let { it }
                        )

                        Spacer(modifier = Modifier.width(16.dp))

                        Text(
                            text = dish,
                            style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Medium)
                        )
                    }
                }
            }
        }
    }
}

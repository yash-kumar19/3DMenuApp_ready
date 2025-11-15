@file:OptIn(org.jetbrains.compose.resources.ExperimentalResourceApi::class)
package com.example.shared.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.shared.viewmodel.DishViewModel
import com.example.shared.models.Dish

@Composable
fun MenuScreen(
    onBack: () -> Unit = {},
    onDishClick: (Dish) -> Unit = {}
) {
    // ViewModel to fetch dishes
    val viewModel = remember { DishViewModel() }

    // Fetch data when Composable first loads
    LaunchedEffect(Unit) { viewModel.fetchDishes() }

    // Observe dishes list
    val dishes by viewModel.dishes.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Screen title
        Text(
            text = "Today's Menu",
            style = MaterialTheme.typography.h5.copy(
                color = Color.Black,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Dishes list
        LazyColumn {
            items(dishes) { dish ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .clickable { onDishClick(dish) },
                    elevation = 6.dp
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(12.dp)
                    ) {
                        // Placeholder for image until drawable added
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                        )

                        Spacer(modifier = Modifier.width(16.dp))

                        // Dish name
                        Text(
                            text = dish.name,
                            style = MaterialTheme.typography.body1.copy(
                                fontWeight = FontWeight.Medium
                            )
                        )
                    }
                }
            }
        }
    }
}

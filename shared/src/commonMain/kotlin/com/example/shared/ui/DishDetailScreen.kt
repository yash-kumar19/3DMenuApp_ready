package com.example.shared.ui


import androidx.compose.runtime.Composable
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.shared.models.Dish

@Composable
fun DishDetailScreen(
    dish: Dish,
    onBack: () -> Unit = {},
    onViewInAR: (Dish) -> Unit = {}
) {
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text(dish.name, style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(8.dp))
        Text(dish.description, style = MaterialTheme.typography.bodyMedium)
        Spacer(Modifier.height(24.dp))
        Button(onClick = { onViewInAR(dish) }) { Text("View in AR") }
    }
}
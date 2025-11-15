package com.example.shared.ui

import androidx.compose.runtime.Composable
import androidx.compose.material.*              // use Material (not Material3)
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
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = dish.name,
            style = MaterialTheme.typography.h5
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = dish.description,
            style = MaterialTheme.typography.body2
        )

        Spacer(modifier = Modifier.height(24.dp))

        Row {
            Button(onClick = { onViewInAR(dish) }) {
                Text("View in AR")
            }

            Spacer(modifier = Modifier.width(12.dp))

            OutlinedButton(onClick = onBack) {
                Text("Back")
            }
        }
    }
}

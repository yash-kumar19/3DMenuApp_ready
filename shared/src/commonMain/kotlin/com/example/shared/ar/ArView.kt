package com.example.shared.ar

import androidx.compose.foundation.layout.*
import androidx.compose.material.*   // ✅ Use Material instead of Material3
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ArViewPlaceholder(dishName: String, onBack: () -> Unit = {}) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "AR coming soon",
            style = MaterialTheme.typography.h5 // ✅ Material-compatible style
        )
        Spacer(Modifier.height(8.dp))
        Text("Dish: $dishName")
        Spacer(Modifier.height(24.dp))
        Button(onClick = onBack) {
            Text("Back")
        }
    }
}

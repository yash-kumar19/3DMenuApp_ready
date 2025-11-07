package com.example.shared.ar



import androidx.compose.runtime.Composable
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ArViewPlaceholder(dishName: String, onBack: () -> Unit = {}) {
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("AR coming soon", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(8.dp))
        Text("Dish: $dishName")
        Spacer(Modifier.height(24.dp))
        Button(onClick = onBack) { Text("Back") }
    }
}
package com.example.shared.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.*           // ✅ Use Material instead of Material3
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun MainScreen(onStartClick: () -> Unit) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF101820)           // Deep background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // App Title
            Text(
                text = "3D MENU APP",
                color = Color.White,
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Main button
            Button(
                onClick = onStartClick,
                colors = ButtonDefaults.buttonColors(
                    backgroundColor = Color(0xFFFFC107)   // ✅ Material-compatible param
                ),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth(0.6f)
                    .height(56.dp)
            ) {
                Text(
                    text = "Explore Menu",
                    color = Color.Black,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

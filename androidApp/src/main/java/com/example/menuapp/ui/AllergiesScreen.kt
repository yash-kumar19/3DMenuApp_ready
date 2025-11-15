package com.example.menuapp.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Fastfood
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.menuapp.R

@Preview
@Composable
fun AllergiesScreen(
    onStartExploring: () -> Unit = {}
) {
    val ingredients = listOf(
        "Peanuts" to R.drawable.ing_peanuts,
        "Eggs" to R.drawable.ing_eggs,
        "Milk" to R.drawable.ing_milk,
        "Shellfish" to R.drawable.ing_shellfish,
        "Tofu" to R.drawable.ing_tofu,
        "Wheat" to R.drawable.ing_wheat
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF3F3F3))
            .padding(horizontal = 16.dp)
    ) {

        Spacer(Modifier.height(40.dp))

        Text(
            text = "Tasty!",
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.align(Alignment.CenterHorizontally)
        )

        Spacer(Modifier.height(20.dp))

        Text(
            text = "Tell us about\nany allergies",
            fontSize = 30.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF21412F),
            textAlign = TextAlign.Center,
            modifier = Modifier.align(Alignment.CenterHorizontally)
        )

        Spacer(Modifier.height(8.dp))

        Text(
            text = "Select any foods you're allergic to or dislike,\nand we'll make sure not to recommend them",
            fontSize = 12.sp,
            color = Color.Gray,
            textAlign = TextAlign.Center,
            modifier = Modifier.align(Alignment.CenterHorizontally)
        )

        Spacer(Modifier.height(20.dp))

        OutlinedTextField(
            value = "",
            onValueChange = {},
            placeholder = { Text("Search Ingredients") },
            trailingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            colors = TextFieldDefaults.colors(
                focusedContainerColor = Color.White,
                unfocusedContainerColor = Color.White
            )
        )

        Spacer(Modifier.height(20.dp))

        // ⭐ RESPONSIVE GRID
        LazyVerticalGrid(
            columns = GridCells.Adaptive(minSize = 110.dp),
            verticalArrangement = Arrangement.spacedBy(18.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            items(ingredients) { (name, img) ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Image(
                        painter = painterResource(img),
                        contentDescription = name,
                        modifier = Modifier
                            .size(100.dp)
                            .clip(RoundedCornerShape(10.dp)),
                        contentScale = ContentScale.Crop
                    )
                    Spacer(Modifier.height(6.dp))
                    Text(name, fontSize = 12.sp)
                }
            }
        }

        Spacer(Modifier.height(14.dp))

        Button(
            onClick = onStartExploring,
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            shape = RoundedCornerShape(10.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF21412F)
            )
        ) {
            Text("Start exploring", color = Color.White)
            Spacer(Modifier.width(6.dp))
            Icon(Icons.Default.Fastfood, contentDescription = null, tint = Color.White)
        }

        Spacer(Modifier.height(20.dp))
    }
}


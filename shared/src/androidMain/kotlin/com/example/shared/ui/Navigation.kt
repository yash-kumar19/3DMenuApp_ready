package com.example.shared.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.shared.viewmodel.DishViewModel
import com.example.shared.ar.ArViewPlaceholder

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val viewModel = remember { DishViewModel() }
    LaunchedEffect(Unit) { viewModel.fetchDishes() }
    val dishes by viewModel.dishes.collectAsState()

    NavHost(navController = navController, startDestination = "menu") {
        composable("menu") {
            MenuScreen(
                onBack = {},
                onDishClick = { dish -> navController.navigate("detail/${dish.id}") }
            )
        }
        composable("detail/{dishId}") { backStackEntry ->
            val id = backStackEntry.arguments?.getString("dishId")?.toIntOrNull()
            val dish = dishes.firstOrNull { it.id == id }
            if (dish != null) {
                DishDetailScreen(
                    dish = dish,
                    onBack = { navController.popBackStack() },
                    onViewInAR = { navController.navigate("ar/${it.id}") }
                )
            }
        }
        composable("ar/{dishId}") { backStackEntry ->
            val id = backStackEntry.arguments?.getString("dishId")?.toIntOrNull()
            val dish = dishes.firstOrNull { it.id == id }
            if (dish != null) {
                ArViewPlaceholder(dishName = dish.name, onBack = { navController.popBackStack() })
            }
        }
    }
}








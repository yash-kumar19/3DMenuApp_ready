package com.example.shared.viewmodel


import com.example.shared.models.Dish
import com.example.shared.network.DishRepository
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

class DishViewModel {

    private val repository = DishRepository()
    private val _dishes = MutableStateFlow<List<Dish>>(emptyList())
    val dishes: StateFlow<List<Dish>> = _dishes

    private val viewModelScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    fun fetchDishes() {
        viewModelScope.launch {
            try {
                _dishes.value = repository.getAllDishes()
            } catch (e: Exception) {
                println("Error fetching dishes: ${e.message}")
            }
        }
    }

    fun addDish(dish: Dish) {
        viewModelScope.launch {
            try {
                repository.addDish(dish)
                fetchDishes()
            } catch (e: Exception) {
                println("Error adding dish: ${e.message}")
            }
        }
    }
}

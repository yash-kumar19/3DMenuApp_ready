package com.example.shared

import io.ktor.client.HttpClient

expect object ApiClient {
    val client: HttpClient
}

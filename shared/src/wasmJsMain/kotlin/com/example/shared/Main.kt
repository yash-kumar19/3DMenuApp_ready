package com.example.shared

import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.ComposeViewport
import kotlinx.browser.document
import com.example.shared.ui.MenuScreen

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    // Mounts your Compose UI (MenuScreen) into the browser window
    ComposeViewport(document.body!!) {
        MenuScreen()
    }
}

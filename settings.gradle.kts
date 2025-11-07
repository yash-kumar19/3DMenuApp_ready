pluginManagement {
    repositories {
        google()
        gradlePluginPortal()
        mavenCentral()
        maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
    }

    plugins {
        id("org.jetbrains.kotlin.multiplatform") version "2.0.21"
        id("org.jetbrains.kotlin.plugin.compose") version "2.0.21"
        id("org.jetbrains.compose") version "1.7.0"
        id("org.jetbrains.kotlin.plugin.serialization") version "2.0.21"
        id("com.android.application") version "8.5.2"
        id("com.android.library") version "8.5.2"
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_PROJECT)
    repositories {
        google()
        mavenCentral()
        maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
    }
}

rootProject.name = "3DMenuApp_ready"
include(":androidApp", ":shared", ":webApp")

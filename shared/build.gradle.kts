plugins {
    id("org.jetbrains.kotlin.multiplatform")
    id("com.android.library")
    id("org.jetbrains.kotlin.plugin.compose")
    id("org.jetbrains.compose")
    id("org.jetbrains.kotlin.plugin.serialization")
}

kotlin {
    androidTarget()
    jvm()
    wasmJs {
        browser()
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(compose.runtime)
                implementation(compose.foundation)
                implementation(compose.material3)
                implementation(compose.ui)
                implementation(compose.components.resources)
                // Coroutines
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
                // Serialization
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
            }
        }

        val androidMain by getting {
            dependencies {
                val ktorVersion = "2.3.12"
                implementation("io.ktor:ktor-client-okhttp:$ktorVersion")
                implementation("androidx.navigation:navigation-compose:2.7.7")
            }
        }
        val jvmMain by getting {
            dependencies {
                val ktorVersion = "2.3.12"
                implementation("io.ktor:ktor-client-okhttp:$ktorVersion")
                implementation("io.ktor:ktor-client-cio:$ktorVersion")
            }
        }
        val wasmJsMain by getting {
            dependencies {
                // no platform-specific deps needed for now
            }
        }
    }

    jvmToolchain(17)
}

android {
    namespace = "com.example.shared"
    compileSdk = 35

    defaultConfig {
        minSdk = 24
    }
}




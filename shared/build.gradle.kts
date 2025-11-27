plugins {
    id("org.jetbrains.kotlin.multiplatform")
    id("com.android.library")
    id("org.jetbrains.kotlin.plugin.compose")
    id("org.jetbrains.compose")
    id("org.jetbrains.kotlin.plugin.serialization")
}

// ================================================================
// ✅ Versions — keep them consistent
// ================================================================
val composeVersion = "1.7.0-beta02"
val ktorVersion = "3.0.0-beta-2"
val coroutinesVersion = "1.8.1"
val serializationVersion = "1.7.3"

// ================================================================
// ✅ Kotlin Multiplatform Setup
// ================================================================
kotlin {
    androidTarget()
    jvm() // For Desktop / Backend
    wasmJs {
        browser {
            commonWebpackConfig {
                outputFileName = "webApp.js"
            }
        }
        binaries.executable()
    }

    sourceSets {
        // 🌍 Common shared code
        val commonMain by getting {
            dependencies {
                // ✅ Compose (use material instead of material3)
                implementation("org.jetbrains.compose.runtime:runtime:$composeVersion")
                implementation("org.jetbrains.compose.foundation:foundation:$composeVersion")
                implementation("org.jetbrains.compose.material:material:$composeVersion")
                implementation("org.jetbrains.compose.ui:ui:$composeVersion")
                implementation("org.jetbrains.compose.components:components-resources:$composeVersion")

                // ✅ Coroutines & Serialization
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutinesVersion")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:$serializationVersion")



                // ✅ Ktor (shared HTTP client setup)
                implementation("io.ktor:ktor-client-core:$ktorVersion")
                implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
                implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
                implementation("io.ktor:ktor-client-logging:$ktorVersion")
            }
        }

        // 🤖 Android
        val androidMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-okhttp:$ktorVersion")
                implementation("androidx.navigation:navigation-compose:2.7.7")
            }
        }

        // 💻 JVM / Desktop
        val jvmMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-cio:$ktorVersion")
            }
        }

        // 🌐 Web (WASM)
        val wasmJsMain by getting {
            dependencies {
                // ✅ use regular ktor-client-js (no wasm suffix)
                implementation("io.ktor:ktor-client-js:$ktorVersion")
                implementation("org.jetbrains.compose.runtime:runtime:$composeVersion")
                implementation("org.jetbrains.compose.foundation:foundation:$composeVersion")
                implementation("org.jetbrains.compose.material:material:$composeVersion")
                implementation("org.jetbrains.compose.ui:ui:$composeVersion")
            }
        }
    }

    jvmToolchain(17)
}

// ================================================================
// ✅ Android Config
// ================================================================
android {
    namespace = "com.example.shared"
    compileSdk = 35

    defaultConfig {
        minSdk = 24
    }
}

// ================================================================
// ✅ Repositories
// ================================================================
repositories {
    google()
    mavenCentral()
    maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
    maven("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
}

plugins {
    id("org.jetbrains.kotlin.multiplatform") version "2.0.21"
    id("org.jetbrains.compose") version "1.7.0"
    id("org.jetbrains.kotlin.plugin.compose")

}

kotlin {
    wasmJs {
        // ✅ Enable browser target for WASM
        browser {
            commonWebpackConfig {
                outputFileName = "webApp.js"

                // ✅ Serve both compiled output and processed resources
                devServer = org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig.DevServer(
                    open = true,
                    static = mutableListOf(
                        "$buildDir/processedResources/wasmJs/main",
                        // ✅ Added this line — the folder where your wasm actually lives
                        "$buildDir/compileSync/wasmJs/main/developmentExecutable/kotlin"
                    )
                )
            }
        }


        // ✅ Generate runnable WebAssembly output
        binaries.executable()
    }

    sourceSets {
        val wasmJsMain by getting {
            dependencies {
                implementation(project(":shared"))

                // Compose Web dependencies
                implementation(compose.runtime)
                implementation(compose.foundation)
                implementation(compose.material)   // ✅ Works with WASM
                implementation(compose.ui)
            }
        }
    }

}

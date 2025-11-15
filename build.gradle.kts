plugins {
    id("com.android.application") apply false
    id("com.android.library") apply false
    id("org.jetbrains.kotlin.multiplatform") apply false
    id("org.jetbrains.kotlin.plugin.serialization") apply false
    id("org.jetbrains.compose") apply false
}

repositories {
    google()
    mavenCentral()
    maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
    maven("https://maven.pkg.jetbrains.space/kotlin/p/kotlin/gradle")
    maven("https://maven.pkg.jetbrains.space/public/p/ktor/eap")
}



// Versions are managed via settings.gradle.kts pluginManagement; no extra buildscript needed

//buildscript {
   // repositories {
    //    google()
    //    mavenCentral()
    //    maven("https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev")

//}

//


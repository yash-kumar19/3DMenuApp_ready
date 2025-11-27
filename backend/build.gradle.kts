plugins {
    kotlin("jvm") // uses Kotlin version from gradle.properties
    id("io.ktor.plugin") version "3.0.0"
    application
}

application {
    mainClass.set("com.example.backend.ApplicationKt")
}

repositories {
    mavenCentral()
}

dependencies {
    val ktorVersion = "3.0.0"
    val kotlinSerializationVersion = "1.6.3"
    val logbackVersion = "1.5.6"
    val coroutinesVersion = "1.9.0" // latest stable

    // ✅ Ktor Server (Core + Engine + Plugins)
    implementation("io.ktor:ktor-server-core:$ktorVersion")
    implementation("io.ktor:ktor-server-netty:$ktorVersion")

    // ✅ Common server plugins
    implementation("io.ktor:ktor-server-cors:$ktorVersion")
    implementation("io.ktor:ktor-server-content-negotiation:$ktorVersion")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
    implementation("io.ktor:ktor-server-call-logging:$ktorVersion")
    implementation("io.ktor:ktor-server-status-pages:$ktorVersion")

    // ✅ Ktor Client (used for calling Supabase REST API)
    implementation("io.ktor:ktor-client-core:$ktorVersion")
    implementation("io.ktor:ktor-client-cio:$ktorVersion")
    implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
    implementation("io.ktor:ktor-client-logging:$ktorVersion")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")

    // ✅ Supabase SDK
    implementation("io.github.jan-tennert.supabase:postgrest-kt:2.0.0")
    implementation("io.github.jan-tennert.supabase:storage-kt:2.0.0")
    implementation("io.github.jan-tennert.supabase:gotrue-kt:2.0.0")
    implementation("io.github.jan-tennert.supabase:realtime-kt:2.0.0")

    // ✅ JSON serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:$kotlinSerializationVersion")

    // ✅ Logging (server logs)
    implementation("ch.qos.logback:logback-classic:$logbackVersion")

    // ✅ Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:$coroutinesVersion")

    // ✅ (Optional) dotenv for local environment variables
    implementation("io.github.cdimascio:dotenv-kotlin:6.4.1")

}

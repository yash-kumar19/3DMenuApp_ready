3DMenuApp - Ready starter (Android + shared KMP)
-----------------------------------------------
What's included:
- Kotlin Multiplatform shared module (Ktor + Coroutines)
- Android app module (Jetpack Compose)
- Gradle Kotlin DSL files configured for Kotlin 2.0.0 and AGP 8.7.2
- Repositories include Google, Maven Central, and JetBrains Kotlin Space (for compose plugin)

How to run:
1. Unzip the folder to a local path (e.g., C:\Projects\3DMenuApp_ready).
2. Open Android Studio Otter (2025.2.1) -> File -> Open -> select the unzipped folder.
3. Let Gradle sync. If asked to update Gradle or plugins, accept recommended actions.
4. Ensure JDK 17 is selected: File -> Project Structure -> SDK Location -> JDK location (set to your JDK 17).
5. Start an emulator or connect a device.
6. Select the 'androidApp' run configuration and press Run ▶️.

Notes:
- This starter deliberately omits a web target to minimize environmental issues on Windows.
- To add Web later, you can add Compose Multiplatform web target once Android is stable.
- If you see dependency issues, run: ./gradlew clean --refresh-dependencies in the terminal.

Replace package name:
- If you want a different applicationId, update androidApp/build.gradle.kts defaultConfig.applicationId and package names in the source files.

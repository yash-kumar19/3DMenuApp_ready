package com.example.backend

import io.github.cdimascio.dotenv.dotenv
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import java.io.File
import java.util.*
import io.ktor.http.content.forEachPart
import io.ktor.http.content.PartData
import io.ktor.utils.io.*

@Serializable
data class Dish(
    val id: String,
    val name: String,
    val description: String? = null,
    val image_url: String? = null
)

fun main() {
    // ✅ Load environment variables from .env file
    val env = dotenv {
        directory = "."
        ignoreIfMissing = false
    }

    val port = env["PORT"]?.toIntOrNull() ?: 8080

    embeddedServer(Netty, port = port) {
        moduleWithEnv(env)
    }.start(wait = true)
}

fun Application.moduleWithEnv(env: io.github.cdimascio.dotenv.Dotenv) {
    // ✅ Read variables from .env
    val supabaseUrl = env["SUPABASE_URL"] ?: error("❌ SUPABASE_URL missing in .env")
    val supabaseKey = env["SUPABASE_SERVICE_KEY"] ?: error("❌ SUPABASE_SERVICE_KEY missing in .env")

    println("✅ Loaded environment from .env")
    println("🌍 Supabase URL: $supabaseUrl")
    println("🔑 Supabase Key (hidden): ${supabaseKey.take(8)}...")

    // ✅ Install essential plugins
    install(ContentNegotiation) { json() }
    install(CORS) { anyHost() }

    val client = HttpClient(CIO)
    suspend fun uploadToSupabaseStorage(
        client: HttpClient,
        supabaseUrl: String,
        supabaseKey: String,
        file: File,
        bucket: String = "uploads"
    ): String {
        val fileBytes = withContext(Dispatchers.IO) { file.readBytes() }
        val fileName = file.name

        val response: HttpResponse = client.post("$supabaseUrl/storage/v1/object/$bucket/$fileName") {
            headers {
                append("apikey", supabaseKey)
                append("Authorization", "Bearer $supabaseKey")
                append(HttpHeaders.ContentType, ContentType.Application.OctetStream.toString())
            }
            setBody(fileBytes)
        }

        if (response.status != HttpStatusCode.OK && response.status != HttpStatusCode.Created) {
            error("❌ Upload to Supabase Storage failed: ${response.status}")
        }

        // Return public file URL
        return "$supabaseUrl/storage/v1/object/public/$bucket/$fileName"
    }

    routing {
        // ✅ Root endpoint
        get("/") {
            call.respondText("✅ Backend running with Supabase + .env integration!")
        }

        // ✅ Fetch dishes from Supabase table
        get("/api/dishes") {
            val response: HttpResponse = client.get("$supabaseUrl/rest/v1/dishes") {
                headers["apikey"] = supabaseKey
                headers["Authorization"] = "Bearer $supabaseKey"
            }
            call.respondText(response.bodyAsText())
        }

        // ✅ Upload route (image or video)
        post("/upload") {
            println("📥 Received /upload request")

            val multipart = call.receiveMultipart()
            var savedFilePath: String? = null
            var fileName: String? = null
            var mimeType: String? = null

            multipart.forEachPart { part ->
                if (part is PartData.FileItem) {
                    fileName = part.originalFileName ?: "upload"
                    mimeType = part.contentType?.toString() ?: "application/octet-stream"
                    println("📦 Receiving file: $fileName")

                    val id = UUID.randomUUID().toString()
                    val fileExtension = File(fileName!!).extension
                    val newFile = File("uploads/${id}.${fileExtension}")

                    // ✅ Ensure uploads folder exists
                    newFile.parentFile.mkdirs()

                    // ✅ Save file using new Ktor 3.x ByteReadChannel API
                    withContext(Dispatchers.IO) {
                        val input: ByteReadChannel = part.provider()
                        newFile.outputStream().use { output ->
                            val buffer = ByteArray(8192)
                            while (!input.isClosedForRead) {
                                val bytesRead = input.readAvailable(buffer, 0, buffer.size)
                                if (bytesRead == -1) break
                                output.write(buffer, 0, bytesRead)
                            }
                        }
                    }

                    println("☁️ Uploading to Supabase Storage...")
                    val publicUrl = uploadToSupabaseStorage(client, supabaseUrl, supabaseKey, newFile)
                    println("✅ Uploaded to Supabase Storage: $publicUrl")
                    savedFilePath = publicUrl

                    part.dispose()
                } else {
                    part.dispose()
                }
            }

            if (savedFilePath == null) {
                call.respond(HttpStatusCode.BadRequest, "❌ No file received.")
                return@post
            }

            // ✅ Send metadata to Supabase
            val insertBody = """
                [
                  {
                    "original_filename": "$fileName",
                    "storage_path": "$savedFilePath",
                    "mime_type": "$mimeType",
                    "kind": "${if (mimeType?.startsWith("video") == true) "video" else "image"}",
                    "status": "uploaded"
                  }
                ]
            """.trimIndent()

            val response: HttpResponse = client.post("$supabaseUrl/rest/v1/uploads") {
                headers {
                    append("apikey", supabaseKey)
                    append("Authorization", "Bearer $supabaseKey")
                    append(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    append("Prefer", "return=representation")
                }
                setBody(insertBody)
            }

            println("✅ Upload metadata sent to Supabase.")
            call.respondText("✅ File uploaded and metadata stored.\nSupabase response:\n${response.bodyAsText()}")
        }
    }
}

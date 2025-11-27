package routes

import config.SupabaseConfig
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import models.Dish

fun Route.dishRoutes() {

    val supabase = SupabaseConfig.client

    // GET all dishes
    get("/api/dishes") {
        val dishes = supabase
            .postgrest["dishes"]
            .select()
            .decodeList<Dish>()

        call.respond(dishes)
    }

    // POST create dish
    post("/api/dishes") {
        val dish = call.receive<Dish>()

        val inserted = supabase
            .postgrest["dishes"]
            .insert(dish)
            .decodeSingle<Dish>()

        call.respond(inserted)
    }

    // DELETE dish
    delete("/api/dishes/{id}") {
        val id = call.parameters["id"] ?: return@delete call.respond("Missing id")

        supabase
            .postgrest["dishes"]
            .delete {
                filter { eq("id", id) }
            }

        call.respond("Deleted")
    }
}

import { supabase } from "@/lib/supabase/client";

export interface Reservation {
    id: string;
    created_at: string;
    restaurant_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    party_size: number;
    reservation_date: string;
    reservation_time: string;
    status: "Pending" | "Confirmed" | "Cancelled";
    special_requests?: string;
}

export const reservationsApi = {
    async getAll() {
        const { data, error } = await supabase
            .from("reservations")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Reservation[];
    },

    async create(reservation: Omit<Reservation, "id" | "created_at" | "status">) {
        const { data, error } = await supabase
            .from("reservations")
            .insert([
                {
                    ...reservation,
                    status: "Pending",
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return data as Reservation;
    },

    async updateStatus(id: string, status: "Pending" | "Confirmed" | "Cancelled") {
        const { data, error } = await supabase
            .from("reservations")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as Reservation;
    },
};

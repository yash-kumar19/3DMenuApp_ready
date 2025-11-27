import { supabase } from "@/lib/supabase/client";

export interface Settings {
    id: string;
    restaurant_name: string;
    address?: string;
    phone?: string;
    email?: string;
    currency: string;
    tax_rate: number;
    service_charge: number;
}

export const settingsApi = {
    async get() {
        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .single();

        if (error) {
            // If no settings found, return default structure (or handle as needed)
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }
        return data as Settings;
    },

    async update(settings: Partial<Settings>) {
        // Check if settings exist first
        const { data: existing } = await supabase.from("settings").select("id").single();

        let result;
        if (existing) {
            result = await supabase
                .from("settings")
                .update(settings)
                .eq("id", existing.id)
                .select()
                .single();
        } else {
            result = await supabase
                .from("settings")
                .insert([settings])
                .select()
                .single();
        }

        if (result.error) throw result.error;
        return result.data as Settings;
    },
};

import { supabase } from "../supabase/client";

export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  model_url?: string;
  status: "draft" | "processing" | "published";
}

export const dishesApi = {
  async getAll() {
    const { data, error } = await supabase.from("dishes").select("*");
    if (error) throw error;
    return data as Dish[];
  },

  async getSession() {
    return await supabase.auth.getSession();
  },

  async create(dish: Omit<Dish, "id">) {
    const { data, error } = await supabase
      .from("dishes")
      .insert(dish)
      .select()
      .single();

    if (error) throw error;
    return data as Dish;
  },

  async update(id: string, updates: Partial<Dish>) {
    const { data, error } = await supabase
      .from("dishes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Dish;
  },

  async delete(id: string) {
    const { error } = await supabase.from("dishes").delete().eq("id", id);
    if (error) throw error;
  },

  async uploadImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("dish-images")
      .upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("dish-images").getPublicUrl(fileName);

    return publicUrl;
  },
};

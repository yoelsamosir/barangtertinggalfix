import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/** Klien Supabase bertipe skema aplikasi. */
export type Supabase = SupabaseClient<Database>;

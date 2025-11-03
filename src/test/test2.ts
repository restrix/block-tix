// src/utils/fetchMovies.ts
import { createClient } from "@supabase/supabase-js";

// --- Replace with your actual Supabase project URL and anon key ---

const SUPABASE_URL = "https://qcesglvsudmmnpffxsnv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZXNnbHZzdWRtbW5wZmZ4c252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTM0NDcsImV4cCI6MjA3NjM2OTQ0N30.y8EVbUE1d3yuAAms45LsW-7vFiBNXiUptrVsZwpNc10";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Movie {
  id: string;
  title: string;
  description?: string;
  poster_url?: string;
  genre?: string;
  duration?: number;
}

async function fetchMovies() {
  try {
    // --- Fetch featured movie ---
    const { data: featuredData, error: featuredError } = await supabase
      .from("movies")
      .select("*")
      .eq("is_featured", true)
      .single();

    if (featuredError) {
      console.error("Error fetching featured movie:", featuredError);
    } else {
      console.log("Featured movie:", featuredData);
    }

    // --- Fetch upcoming movies ---
    const { data: upcomingData, error: upcomingError } = await supabase
      .from("movies")
      .select("*")
      .order("date", { ascending: true });

    if (upcomingError) {
      console.error("Error fetching upcoming movies:", upcomingError);
    } else {
      console.log("Upcoming movies:", upcomingData);
    }
  } catch (err) {
    console.error("Unexpected error fetching movies:", err);
  }
}

// Execute the function
fetchMovies();

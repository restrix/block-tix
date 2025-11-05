"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedButton } from "@/components/ui/animated-button";

interface Movie {
  id: string;
  title: string;
  description?: string;
  poster_url?: string;
  genre?: string;
  duration?: number;
  price?: number; // INR
  price_sol?: number; // SOL
  total_tickets?: number;
  available_tickets?: number;
  event_date: string; // ISO string
  event_time: string; // HH:MM:SS
  venue?: string;
}

export function FeaturedEvent() {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchLatestEvent = async () => {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("event_date", { ascending: false }) // latest event first
        .limit(1)
        .single();

      if (error) {
        console.error("Failed to fetch featured movie:", error);
        setMovie(null);
      } else {
        setMovie(data);
      }
    };

    fetchLatestEvent();
  }, []);

  if (!movie) {
    return <div className="p-4 text-white">No featured event available.</div>;
  }

  // Ticket info
  const price = movie.price || 0;
  const availableTickets = movie.available_tickets || 0;
  const totalTickets = movie.total_tickets || 100;
  const percentageSold = Math.round(((totalTickets - availableTickets) / totalTickets) * 100);
  const isSoldOut = availableTickets === 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotate: 1 }}
      className="rounded-2xl overflow-hidden p-[2px] bg-gradient-to-r from-emerald-400 via-purple-500 to-indigo-500 animate-border"
    >
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-900/20 to-purple-900/20 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative aspect-video md:aspect-auto overflow-hidden">
            <img
              src={movie.poster_url || "/images/sample-ticket.png"}
              alt={movie.title}
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:hidden">
              <Badge className="self-start mb-2 bg-emerald-500/80 backdrop-blur-sm">Featured</Badge>
              <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
              <p className="text-white/90">{movie.duration ? `${movie.duration} min` : ""}</p>
            </div>
          </div>

          <CardContent className="p-6 flex flex-col justify-between bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md">
            <div className="space-y-4">
              <Badge className="mb-2 bg-emerald-500/80 backdrop-blur-sm text-white">Featured</Badge>
              <h2 className="text-3xl font-bold mb-2 text-white">{movie.title}</h2>
              <p className="text-gray-300">{movie.description}</p>
              <p className="text-gray-400 text-sm">
                {movie.event_date} at {movie.event_time} | Venue: {movie.venue || "TBD"}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageSold}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-between text-white">
                <p className="font-medium text-lg">₹{price}</p>
                <p className="text-sm text-emerald-400">{percentageSold}% sold</p>
              </div>
              <AnimatedButton
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                asChild
              >
                <Link to={`/movies/${movie.id}`}>
                  {isSoldOut ? "Join Waitlist" : "Get Tickets"}
                </Link>
              </AnimatedButton>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

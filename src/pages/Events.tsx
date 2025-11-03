import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { EventCard } from "@/components/events/event-card"; // your movie card

interface EventItem {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  poster_url?: string;
  genre?: string;
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // fetch movies from database
        const response = await fetch("/api/rest/v1/movies?select=*&order=title.asc");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch events`);
        }

        const data: EventItem[] = await response.json();
        setEvents(data);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-16 text-white">Loading events...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-16 text-red-400">
          <p>{error}</p>
        </div>
      </MainLayout>
    );
  }

  if (events.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-16 text-white">
          <p>No events found.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

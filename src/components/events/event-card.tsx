import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface EventItem {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  poster_url?: string;
  genre?: string;
}

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card className="bg-gray-900 shadow-lg rounded-lg hover:scale-105 transition-transform duration-200 border border-gray-700">
  <CardContent className="flex flex-col items-center">
    {event.poster_url && (
      <img
        src={event.poster_url}
        alt={event.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
    )}
    <h3 className="text-lg font-bold mb-2 text-center text-white">{event.title}</h3>
    <p className="text-sm text-gray-300 mb-4 line-clamp-3">{event.description}</p>
    <p className="text-sm text-gray-400 mb-2">
      Duration: {event.duration ? `${event.duration} mins` : "N/A"}
    </p>
    <p className="text-sm text-gray-400 mb-4">Genre: {event.genre || "N/A"}</p>
    <Button
      onClick={handleDetailsClick}
      className="w-full bg-primary text-white hover:bg-primary/90"
    >
      More Details
    </Button>
  </CardContent>
</Card>

  );
}

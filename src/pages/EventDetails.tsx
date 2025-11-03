"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, MapPin, MinusCircle, PlusCircle, Share2, ExternalLink, Users } from "lucide-react";
import { BuyTicket } from "@/components/tickets/BuyTicket";
import { formatDate, formatPrice } from "@/lib/utils";

interface Movie {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  poster_url?: string;
  genre?: string;
  price: number;         // from "price" column
  price_sol: number;     // from "price_sol" column
  total_tickets: number; // from "total_tickets"
  available_tickets: number; // from "available_tickets"
  event_date: string;    // from "event_date"
  event_time: string;    // from "event_time"
  venue: string;         // from "venue"
}


export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  // ✅ Hooks must always be at the top
  const [events, setEvents] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/rest/v1/movies?select=*&order=title.asc"); // still fetching movies in DB
        if (!res.ok) throw new Error("Failed to fetch events");
        const data: Movie[] = await res.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-16 text-white">Loading event...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-16 text-red-400">{error}</div>
      </MainLayout>
    );
  }

  const eventItem = events.find((e) => e.id === id);

  if (!eventItem) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <a href="/events">
            <Button>Browse Events</Button>
          </a>
        </div>
      </MainLayout>
    );
  }

  // Treat movie as event for UI
  const event = {
  id: eventItem.id,
  title: eventItem.title,
  description: eventItem.description,
  date: `${eventItem.event_date}T${eventItem.event_time}`, // combine date + time
  image: eventItem.poster_url || "",
  category: eventItem.genre || "Event",
  availableTickets: eventItem.available_tickets,
  price: eventItem.price,
  price_sol: eventItem.price_sol,   // use actual SOL price from DB
  currency: "SOL",
  resaleEnabled: true,
  resalePriceCap: eventItem.price_sol, // you can adjust if you have a separate column
  location: eventItem.venue,
  organizer: "Event Organizer", // keep static or fetch dynamically
};

  const isSoldOut = event.availableTickets === 0;
  const maxTickets = Math.min(event.availableTickets, 5);

  const handleQuantityChange = (value: number) => {
    if (value < 1) value = 1;
    if (value > maxTickets) value = maxTickets;
    setQuantity(value);
  };

  return (
    <MainLayout>
      <div className="relative overflow-hidden bg-gradient-to-b from-solana-dark to-black text-white">
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(${event.image})` }}
        ></div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <Badge className="mb-4 bg-solana-purple">{event.category}</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-white/80 space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-white/80 space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-white/80 space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{event.availableTickets} tickets left</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </Button>
              </div>
            </div>

            <div className="md:w-1/3">
              <Card className="w-full backdrop-blur-md bg-white/10 border-white/20">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-1">
                      ₹{event.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </h3>
                    <p className="text-white/60">per ticket</p>
             </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Available</span>
                      <span className={isSoldOut ? "text-red-400" : ""}>{isSoldOut ? "Sold Out" : `${event.availableTickets} tickets`}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Limit</span>
                      <span>5 per transaction</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Resale</span>
                      <span>{event.resaleEnabled ? "Allowed" : "Not Allowed"}</span>
                    </div>
                    {event.resaleEnabled && (
                      <div className="flex items-center justify-between">
                        <span>Resale Cap</span>
                        <span>{formatPrice(event.resalePriceCap)}</span>
                      </div>
                    )}
                    <Separator className="bg-white/20" />
                    <div>
                      <label className="block mb-2">Quantity</label>
                      <div className="flex">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/10 border-white/20 hover:bg-white/20"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1 || isSoldOut}
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <input
                          type="number"
                          min={1}
                          max={maxTickets}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                          className="mx-2 bg-white/10 border-white/20 text-center w-16"
                          disabled={isSoldOut}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white/10 border-white/20 hover:bg-white/20"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= maxTickets || isSoldOut}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(event.price * quantity)}</span>
                    </div>

                    <BuyTicket event={{ ...event, price: event.price_sol }} disabled={isSoldOut} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <p className="text-muted-foreground whitespace-pre-line mb-8">{event.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-6">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <span className="text-muted-foreground ml-2">Cinema Preview</span>
            </div>
            <address className="not-italic text-muted-foreground mb-6">{event.location}</address>
            <Button variant="outline" className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              View Directions
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

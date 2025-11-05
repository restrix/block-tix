import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { EventCard } from "@/components/events/event-card";
import { FeaturedEvent } from "@/components/events/featured-event";
import { AuctionCard } from "@/components/auctions/auction-card";
import { HeroSection } from "@/components/sections/Hero";
import { supabase } from "@/integrations/supabase/client"; // adjust if needed
import { ArrowRight, Calendar, MapPinned, ShieldCheck, Ticket, Wallet } from "lucide-react";

export default function Index() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("movies").select("*");
      if (error) {
        console.error("Error fetching events:", error);
      } else if (data) {
        setEvents(data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-32 text-center text-xl font-semibold">
          Loading events...
        </div>
      </MainLayout>
    );
  }

  if (!events.length) {
    return (
      <MainLayout>
        <div className="container mx-auto py-32 text-center text-xl font-semibold">
          No events found.
        </div>
      </MainLayout>
    );
  }

  const featuredEvent = events.find((event) => event.featured) || events[0];
  const upcomingEvents = events.filter((event) => !event.featured).slice(0, 3);

  return (
    <MainLayout>
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SolanaTickets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fraud-Proof Tickets</h3>
              <p className="text-muted-foreground text-sm">Each ticket is a unique NFT on Solana's blockchain, making it impossible to counterfeit or duplicate.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Secondary Market</h3>
              <p className="text-muted-foreground text-sm">Resell tickets through secure blind auctions with price caps to prevent scalping and ensure fair access.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Verification</h3>
              <p className="text-muted-foreground text-sm">Dynamic QR codes and on-chain verification make entry to events seamless and secure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Event</h2>
            <Button variant="ghost" className="group" asChild>
              <Link to="/events" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <FeaturedEvent event={featuredEvent} />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Button variant="ghost" className="group" asChild>
              <Link to="/events" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  ...event,
                  image: event.image || "/placeholder.jpg", // fallback image
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

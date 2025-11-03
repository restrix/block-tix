import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Button } from "@/components/ui/button";
import { TicketCard } from "@/components/tickets/ticket-card";
import { Event, Ticket } from "@/lib/mock-data";

interface TicketsTabProps {
  events: Event[];
}

export function TicketsTab({ events }: TicketsTabProps) {
  const { publicKey } = useWallet();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setTickets([]);
      return;
    }

    const connection = new Connection(clusterApiUrl("devnet")); // or "mainnet-beta"
    const metaplex = Metaplex.make(connection);



    const fetchTickets = async () => {
      setLoading(true);
      try {
        const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });

        const ticketData: Ticket[] = await Promise.all(
          nfts.map(async (nft) => {
            try {
              const res = await fetch(nft.uri);
              const metadata = await res.json();

              // get mint address safely
              // get mint address safely
              let mint = "";
              if ("mint" in nft && nft.mint && "toBase58" in nft.mint) {
                mint = nft.mint.toBase58();
              } else if ("address" in nft && nft.address && "toBase58" in nft.address) {
                mint = nft.address.toBase58();
              }


              return {
                id: mint,
                eventId: metadata.eventId || "unknown",
                name: metadata.name || "Unnamed Ticket",
                image: metadata.image || "",
                price: metadata.price || 0,
                currency: metadata.currency || "SOL",
                available: true,
                seatNumber: metadata.seatNumber || "General",
                status: "minted", // required literal type
              };
            } catch (err) {
              console.warn("Failed to fetch NFT metadata", err);
              return null;
            }
          })
        );

        setTickets(ticketData.filter((t): t is Ticket => t !== null));
      } catch (err) {
        console.error("Failed to fetch NFTs:", err);
        setTickets([]);
      }
      setLoading(false);
    };

    fetchTickets();
  }, [publicKey]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Your Tickets ({tickets.length})
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-16">Loading your tickets...</div>
      ) : tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const event = events.find((e) => e.id === ticket.eventId);
            return (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                event={event || { id: "unknown", name: "Unknown Event" }}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't purchased any tickets yet.
          </p>
          <Button asChild>
            <a href="/events">Browse Events</a>
          </Button>
        </div>
      )}
    </>
  );
}

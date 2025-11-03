import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate, formatPrice } from "@/lib/utils";
import { Calendar, ExternalLink, MapPin, QrCode, Ticket as TicketIcon } from "lucide-react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey, Connection } from "@solana/web3.js";
import { fetchNFTsForWallet } from "@/services/fetcher"; // create a helper service to fetch NFTs

interface TicketCardProps {
  ticket: {
    seatNumber: string;
    price: number;
    currency: string;
    mintAddress?: string; // NFT mint address
    status: "minted" | "reserved" | "available";
  };
  event: {
    title: string;
    date: string;
    location: string;
    resaleEnabled: boolean;
  };
}

export function TicketCard({ ticket, event }: TicketCardProps) {
  const { publicKey, connected } = useSolanaWallet();
  const [ownedNFTs, setOwnedNFTs] = useState<string[]>([]);

  useEffect(() => {
    if (!connected || !publicKey) return;

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    fetchNFTsForWallet(connection, publicKey)
      .then((mints) => setOwnedNFTs(mints))
      .catch((err) => console.error("Error fetching NFTs:", err));
  }, [publicKey, connected]);

  const ownsNFT = ticket.mintAddress ? ownedNFTs.includes(ticket.mintAddress) : false;

  return (
    <Card className="overflow-hidden group hover:scale-105 transition-all duration-300 h-full flex flex-col bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 hover:shadow-lg hover:shadow-orange-500/10">
      <CardHeader className="pb-2 relative">
        <div className="absolute -top-6 -right-6 bg-solana-purple/10 w-20 h-20 rounded-full blur-xl"/>
        <div className="absolute -bottom-6 -left-6 bg-solana-blue/10 w-20 h-20 rounded-full blur-xl"/>
        <div className="relative">
          <h3 className="text-lg font-semibold truncate">{event.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-3 flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm space-x-2">
            <TicketIcon className="h-4 w-4" />
            <span className="font-medium">Seat {ticket.seatNumber}</span>
          </div>
          <Badge variant={ownsNFT ? "outline" : "secondary"}>
            {ownsNFT ? "Owned" : ticket.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Ticket price: {formatPrice(ticket.price, ticket.currency)}
        </div>
        {ticket.mintAddress && (
          <div className="flex items-center text-xs text-muted-foreground space-x-2 overflow-hidden">
            <span className="truncate">NFT: {ticket.mintAddress}</span>
            <a
              href={`https://explorer.solana.com/address/${ticket.mintAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" disabled={!connected}>
          <QrCode className="mr-2 h-4 w-4" />
          View Ticket
        </Button>
        {event.resaleEnabled && ownsNFT && (
          <Button variant="outline">
            List for Sale
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

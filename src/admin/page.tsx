"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Menu, Ticket, BarChart3, Settings, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AdminDashboard() {
  const { connected, publicKey, disconnect } = useWallet();
  const [activePage, setActivePage] = useState("dashboard");

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey
        .toBase58()
        .slice(-4)}`
    : "Not Connected";

  const menuItems = [
    { name: "Dashboard", icon: <BarChart3 size={18} />, id: "dashboard" },
    { name: "Create Event", icon: <Ticket size={18} />, id: "create" },
    { name: "Manage Events", icon: <Menu size={18} />, id: "manage" },
    { name: "Settings", icon: <Settings size={18} />, id: "settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-blue-600">Block-Tix</h1>
          </div>
          <nav className="flex flex-col mt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-3 px-6 py-3 text-left hover:bg-blue-100 transition ${
                  activePage === item.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-2 text-red-500 hover:text-red-600"
            onClick={disconnect}
          >
            <LogOut size={18} /> Disconnect
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold capitalize">
              {activePage.replace("-", " ")}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <WalletMultiButton />
            <Card className="px-3 py-1 bg-gray-50 border border-gray-200 text-sm">
              {connected ? (
                <p className="font-mono text-gray-700">{shortAddress}</p>
              ) : (
                <p className="text-gray-400">Wallet not connected</p>
              )}
            </Card>
          </div>
        </header>

        {/* Dynamic page content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activePage === "dashboard" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-gray-600">
                Welcome to your admin dashboard. You can create and manage
                events, view analytics, and handle ticket sales here.
              </p>
            </div>
          )}

          {activePage === "create" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
              <p className="text-gray-500">
                (We’ll build the event creation form next.)
              </p>
            </div>
          )}

          {activePage === "manage" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Manage Events</h3>
              <p className="text-gray-500">
                (Upcoming: View and edit your events here.)
              </p>
            </div>
          )}

          {activePage === "settings" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <p className="text-gray-500">
                (Later: Update preferences, theme, or admin wallet.)
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

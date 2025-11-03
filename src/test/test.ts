import { NFTStorage } from "nft.storage";
import dotenv from "dotenv";

dotenv.config();
const API_KEY = process.env.NFT_STORAGE_API_KEY!;
const client = new NFTStorage({ token: API_KEY });

async function test() {
    try {
        const status = await client.status("bafkreigh2akiscaildc6exxxxx"); // any random CID
        console.log("✅ NFT.Storage API reachable!");
    } catch (err) {
        console.error("❌ NFT.Storage unreachable or invalid key:", err);
    }
}

test();

const SUPABASE_URL = "https://qcesglvsudmmnpffxsnv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZXNnbHZzdWRtbW5wZmZ4c252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTM0NDcsImV4cCI6MjA3NjM2OTQ0N30.y8EVbUE1d3yuAAms45LsW-7vFiBNXiUptrVsZwpNc10";

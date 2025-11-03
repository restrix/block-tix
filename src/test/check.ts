// checkKey.ts
import dotenv from "dotenv";
dotenv.config();
const raw = process.env.WALLET_SECRET_KEY;
if (!raw) throw new Error("WALLET_SECRET_KEY missing");
const arr = raw.split(",").map(s => Number(s));
console.log("Count:", arr.length);
if (arr.length !== 64) throw new Error("Secret key must be 64 numbers");
console.log("OK — looks like 64 numbers");

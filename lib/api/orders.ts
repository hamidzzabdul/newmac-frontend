// import { auth } from "@clerk/nextjs/server";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function to254(phone: string) {
  const p = phone.replace(/\s+/g, "").replace("+", "");
  if (p.startsWith("254")) return p;
  if (p.startsWith("0")) return "254" + p.slice(1);
  return p; // last resort
}

export const createOrder = async(payload: any) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

export const startMpesaStkPush = async (orderId: string, phone: string)=> {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/mpesa/stkpush`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
      cache: "no-store",
    });
  
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function getOrder(orderId: string) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
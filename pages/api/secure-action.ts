import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "@/utils/supabaseClient";

// Carrega variáveis do .env.local automaticamente em ambiente Next.js
// (Next.js já faz isso para process.env)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customerId, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customerId,
    });

    const { data, error } = await supabaseAdmin
      .from("payments")
      .insert([{ customer_id: customerId, amount }]);

    if (error) throw error;

    res.status(200).json({ paymentIntent, dbInsert: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any }) 
  : null;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    if (stripe) {
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "CodeVerse Pro Plan",
                description: "Unlimited files, custom editor themes, and cloud sharing links.",
              },
              unit_amount: 1000, 
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/dashboard?checkout=success`,
        cancel_url: `${origin}/dashboard?checkout=cancel`,
        metadata: { userId },
      });

      return NextResponse.json({ url: checkoutSession.url, stripeActive: true });
    } else {
      return NextResponse.json({ 
        url: `${origin}/dashboard?checkout=mock_success`, 
        stripeActive: false,
        message: "Stripe simulation mode active."
      });
    }
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ message: error.message || "Stripe server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/hooks/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in before checkout." },
        { status: 401 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!siteUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SITE_URL is not set." },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_ID is not set." },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      client_reference_id: user.id,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session." },
      { status: 500 }
    );
  }
}
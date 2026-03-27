import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT: service role
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // 🎯 THIS IS THE IMPORTANT PART
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;

    if (!email) {
      console.error("No email found on session");
      return NextResponse.json({ received: true });
    }

    // 🔍 Find user by email
    const { data: users, error: userError } =
      await supabase.auth.admin.listUsers();

    if (userError) {
      console.error(userError);
      return NextResponse.json({ received: true });
    }

    const user = users.users.find((u) => u.email === email);

    if (!user) {
      console.error("User not found for email:", email);
      return NextResponse.json({ received: true });
    }

    // ✅ Update seller_profiles
    const { error: updateError } = await supabase
      .from("seller_profiles")
      .update({ is_paid: true })
      .eq("user_id", user.id);

    if (updateError) {
      console.error(updateError);
    } else {
      console.log("User unlocked:", email);
    }
  }

  return NextResponse.json({ received: true });
}
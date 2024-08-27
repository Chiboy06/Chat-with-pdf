"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession(userDetails: UserDetails) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  //   first check if the user already has a stripeCustomerId
  let stripeCustomerId;

  const user = await adminDb.collection("users").doc(userId).get();
  stripeCustomerId = user.data()?.stripeCustomerId;
  
  if (!stripeCustomerId) {
    try {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: userDetails.email,
        name: userDetails.name,
        metadata: {
          userId,
        },
      });

      // Save the new stripeCustomerId in Firestore
      await adminDb.collection("users").doc(userId).set(
        {
          stripeCustomerId: customer.id,
        },
      );

      stripeCustomerId = customer.id;
    } catch (error) {
      console.error("Failed to create Stripe customer:", error);
      throw new Error("Failed to create Stripe customer");
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", 'link', 'paypal'],
    line_items: [
      {
        price: "price_1PqS0BLXahOu4z1BdIKidnO1",
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: stripeCustomerId,
    success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
    cancel_url: `${getBaseUrl()}/upgrade`,
  });
  return session.id;
}
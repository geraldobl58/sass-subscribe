import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { db } from "./db";

export const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2024-04-10",
});

export async function hasSubscription() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await db.user.findFirst({
      where: {
        email: session.user?.email,
      },
    });

    const subscriptions = await stripe.subscriptions.list({
      customer: user?.stripe_customer_id as string,
    });

    return subscriptions.data.length > 0;
  }

  return false;
}

export async function createCheckoutLink(customer: string) {
  const checkout = await stripe.checkout.sessions.create({
    success_url: "http://localhost:3000/dashboard&success=true",
    cancel_url: "http://localhost:3000/dashboard&success=true",
    customer: customer,
    line_items: [
      {
        price: "price_1PBgKUEHlldMj1exb880eiz0",
        quantity: 1,
      },
    ],
    mode: "subscription",
  });

  return checkout.url;
}

export async function generateCustomerPortalLink(customerId: string) {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return portalSession.url;
  } catch (error) {
    console.log(error);

    return undefined;
  }
}

export async function createCustomerIfNull() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await db.user.findFirst({
      where: {
        email: session.user?.email,
      },
    });

    if (!user?.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: session.user?.email as string,
      });

      await db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          stripe_customer_id: customer.id,
        },
      });
    }

    const user2 = await db.user.findFirst({
      where: {
        email: session.user?.email,
      },
    });

    return user2?.stripe_customer_id;
  }
}

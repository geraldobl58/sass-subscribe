import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

import Stripe from "stripe";

import {
  createCheckoutLink,
  createCustomerIfNull,
  generateCustomerPortalLink,
  hasSubscription,
} from "@/lib/billing";

import { db } from "@/lib/db";
import Image from "next/image";

export const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2024-04-10",
});

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  await createCustomerIfNull();

  const user = await db.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  const manage_link = await generateCustomerPortalLink(
    user?.stripe_customer_id as string
  );

  const hasSub = await hasSubscription();
  const checkout_link = await createCheckoutLink(
    user?.stripe_customer_id as string
  );

  return (
    <div className="max-w-4xl m-auto w-full px-4">
      <div className="flex flex-col">
        <p className="text-2xl font-medium">Olá, {session?.user?.name}</p>
        <div className="flex items-center justify-between mt-8">
          <div>
            <Link href={manage_link as string}>Gerenciar faturamento</Link>
          </div>
          <div>
            {hasSub ? (
              <div>
                <p className="text-fuchsia-600 font-semibold">
                  Seu plano atual agora é pago, aproveite!
                </p>
              </div>
            ) : (
              <div>
                <>Seu plano atual é gratuito</>
                <Link
                  href={checkout_link as string}
                  className="px-2 py-2 ml-2 bg-violet-700 text-white rounded-full"
                >
                  Upgrade
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="mt-10">
          {hasSub ? (
            <div>
              <Image alt="Cover" width={300} height={300} src="/cover.jpg" />
            </div>
          ) : (
            <div>
              <p className="text-zinc-700-600 font-semibold">
                Você não tem acesso à imagem da propriedade.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

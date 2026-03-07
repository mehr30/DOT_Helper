"use server";

// Stripe Server Actions for Greenlight DOT SaaS
// These actions handle creating Checkout Sessions and Customer Portal sessions
// Billing is per-company: each company has its own Stripe subscription.

import Stripe from "stripe";
import { requireCompanyUser } from "../../lib/session";
import { prisma } from "@repo/database";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: "2025-12-18.acacia" as Stripe.LatestApiVersion,
});

// Price IDs — replace with real Stripe Price IDs from your dashboard
const PRICE_IDS = {
    starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || "price_starter_monthly",
    starter_yearly: process.env.STRIPE_PRICE_STARTER_YEARLY || "price_starter_yearly",
    professional_monthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || "price_professional_monthly",
    professional_yearly: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY || "price_professional_yearly",
    enterprise_monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "price_enterprise_monthly",
    enterprise_yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || "price_enterprise_yearly",
};

export async function createCheckoutSession(planKey: string, isYearly: boolean) {
    const { companyId } = await requireCompanyUser();

    const period = isYearly ? "yearly" : "monthly";
    const priceKey = `${planKey}_${period}` as keyof typeof PRICE_IDS;
    const priceId = PRICE_IDS[priceKey];

    if (!priceId) {
        return { error: "Invalid plan selected" };
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                companyId,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/cancel`,
            subscription_data: {
                trial_period_days: 14,
                metadata: {
                    companyId,
                },
            },
            allow_promotion_codes: true,
        });

        return { url: session.url };
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return { error: "Failed to create checkout session. Please try again." };
    }
}

export async function createPortalSession() {
    const { companyId } = await requireCompanyUser();

    // Look up the company's Stripe customer ID
    const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { stripeCustomerId: true },
    });

    if (!company?.stripeCustomerId) {
        return { error: "No billing account found for this company. Please subscribe to a plan first." };
    }

    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: company.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
        });

        return { url: session.url };
    } catch (error) {
        console.error("Stripe portal error:", error);
        return { error: "Failed to open billing portal." };
    }
}

/**
 * Handle Stripe webhook events. Called from the webhook API route.
 * Stores subscription data on the Company record.
 */
export async function handleStripeWebhook(event: Stripe.Event) {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const companyId = session.metadata?.companyId;
            if (!companyId) break;

            await prisma.company.update({
                where: { id: companyId },
                data: {
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: session.subscription as string,
                    subscriptionStatus: "active",
                },
            });
            break;
        }

        case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const companyId = subscription.metadata?.companyId;
            if (!companyId) break;

            await prisma.company.update({
                where: { id: companyId },
                data: {
                    subscriptionStatus: subscription.status,
                    stripePriceId: subscription.items.data[0]?.price?.id ?? null,
                    trialEndsAt: subscription.trial_end
                        ? new Date(subscription.trial_end * 1000)
                        : null,
                },
            });
            break;
        }

        case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const companyId = subscription.metadata?.companyId;
            if (!companyId) break;

            await prisma.company.update({
                where: { id: companyId },
                data: {
                    subscriptionStatus: "canceled",
                    stripeSubscriptionId: null,
                },
            });
            break;
        }
    }
}

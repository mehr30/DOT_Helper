"use server";

// Stripe Server Actions for DOT Helper SaaS
// These actions handle creating Checkout Sessions and Customer Portal sessions

import Stripe from "stripe";

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
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/cancel`,
            subscription_data: {
                trial_period_days: 14,
            },
            allow_promotion_codes: true,
        });

        return { url: session.url };
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return { error: "Failed to create checkout session. Please try again." };
    }
}

export async function createPortalSession(customerId: string) {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
        });

        return { url: session.url };
    } catch (error) {
        console.error("Stripe portal error:", error);
        return { error: "Failed to open billing portal." };
    }
}

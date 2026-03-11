import type { Metadata } from "next";
import StaticPageLayout from "../components/StaticPageLayout";

export const metadata: Metadata = {
    title: "About Greenlight USDOT — DOT Compliance Made Simple",
    description: "Greenlight USDOT helps small fleet owners stay DOT compliant without the complexity. Built by people who understand trucking compliance.",
    alternates: { canonical: "/about" },
};

export default function AboutPage() {
    return (
        <StaticPageLayout
            title="About Greenlight USDOT"
            subtitle="DOT compliance shouldn't require a law degree. We built Greenlight to make it simple."
        >
            <h2>Why We Exist</h2>
            <p>
                If you run a small fleet — whether that&apos;s 2 trucks or 50 — you know the feeling. You&apos;re trying to run a business, but you&apos;re buried in compliance paperwork. Driver files, medical cards, annual inspections, drug testing, Clearinghouse queries, MVR pulls, HOS logs. The list never ends, and missing one item can mean an $11,000+ fine.
            </p>
            <p>
                We built Greenlight USDOT because we saw too many good businesses getting hit with violations — not because they were doing anything unsafe, but because they forgot to renew a medical card or missed an annual MVR pull. The rules aren&apos;t complicated. But keeping track of everything, for every driver, every vehicle, every deadline? That&apos;s where people fall behind.
            </p>

            <h2>What We Do</h2>
            <p>
                Greenlight USDOT is a compliance management platform designed specifically for small and mid-size fleets. We track your driver qualification files, vehicle maintenance schedules, drug testing program, and every other DOT requirement — and we send you alerts before anything expires or comes due.
            </p>
            <p>
                Think of it as your compliance department in a box. No more spreadsheets. No more sticky notes on the filing cabinet. No more panic when you get the audit letter.
            </p>

            <h2>Who We&apos;re Built For</h2>
            <ul>
                <li><strong>Trucking companies</strong> running 1-50 trucks</li>
                <li><strong>Home service businesses</strong> with box trucks and service vehicles</li>
                <li><strong>Construction companies</strong> hauling equipment</li>
                <li><strong>Any business</strong> operating vehicles over 10,001 lbs GVWR</li>
            </ul>
            <p>
                If you have a USDOT number (or need one), Greenlight is built for you.
            </p>

            <h2>Our Approach</h2>
            <p>
                We believe compliance tools should speak your language — not regulator language. You won&apos;t find CFR codes or legal jargon in our platform. Just plain English telling you what you need, when you need it, and how to get it done.
            </p>
        </StaticPageLayout>
    );
}

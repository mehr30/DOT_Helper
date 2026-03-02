import type { MetadataRoute } from "next";

const BASE_URL = "https://dothelper.com";

const pillarSlugs = [
    "dot-compliance-checklist",
    "fmcsa-compliance-guide",
    "driver-qualification-file-requirements",
    "vehicle-maintenance-compliance-guide",
    "drug-alcohol-testing-compliance",
];

const clusterSlugs = [
    // Pillar 1: DOT Compliance
    "how-to-pass-dot-audit",
    "dot-compliance-costs-fines",
    "new-entrant-safety-audit",
    "usdot-number-requirements",
    "ucr-registration-guide",
    "boc-3-filing-guide",
    "mcs-150-biennial-update",
    "ifta-reporting-guide",
    "state-dot-compliance-requirements",
    "dot-compliance-owner-operators",
    "common-dot-violations",
    // Pillar 2: FMCSA Regulations
    "csa-scores-explained",
    "fmcsa-operating-authority-guide",
    "dot-insurance-requirements",
    "fmcsa-safety-ratings",
    "dot-audit-document-checklist",
    "interstate-vs-intrastate-compliance",
    "accident-register-requirements",
    "fmcsa-compliance-review-process",
    "dot-compliance-officer-role",
    // Pillar 3: Driver Compliance
    "hos-rules-explained",
    "fmcsa-clearinghouse-guide",
    "cdl-requirements-guide",
    "dot-medical-card-requirements",
    "eld-compliance-guide",
    "mvr-guide-for-carriers",
    "short-haul-exemption-guide",
    "entry-level-driver-training",
    "annual-certificate-of-violations",
    "hiring-cdl-drivers-compliance",
    // Pillar 4: Vehicle Maintenance
    "dvir-best-practices",
    "preventive-maintenance-program-guide",
    "annual-dot-inspection-guide",
    "brake-compliance-guide",
    "tire-compliance-requirements",
    "roadside-inspection-guide",
    "trailer-maintenance-requirements",
    "vehicle-marking-requirements",
    "fleet-maintenance-records",
    "emergency-equipment-requirements",
    // Pillar 5: Drug & Alcohol Testing
    "random-drug-testing-requirements",
    "reasonable-suspicion-training-guide",
    "post-accident-drug-testing",
    "dot-drug-testing-panel",
    "sap-return-to-duty-process",
    "building-drug-alcohol-policy",
    "drug-testing-consortium-guide",
    "drug-testing-record-retention",
    "dot-alcohol-testing-requirements",
];

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${BASE_URL}/pricing`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/features`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/register`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.4,
        },
    ];

    const pillarPages: MetadataRoute.Sitemap = pillarSlugs.map((slug) => ({
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    const clusterPages: MetadataRoute.Sitemap = clusterSlugs.map((slug) => ({
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [...staticPages, ...pillarPages, ...clusterPages];
}

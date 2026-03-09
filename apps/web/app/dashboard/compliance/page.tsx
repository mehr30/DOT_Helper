import { getServerSession } from "../../../lib/session";
import { getComplianceScores } from "../../actions/compliance";
import { getComplianceReviewStatus } from "../../actions/company";
import ComplianceContent from "./ComplianceContent";

export default async function CompliancePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
    const session = await getServerSession();
    const params = await searchParams;
    let scores: Awaited<ReturnType<typeof getComplianceScores>> | null = null;
    let lastReviewAt: string | null = null;

    if (session?.user) {
        try {
            scores = await getComplianceScores();
        } catch {
            // User may not have a company yet
        }
        try {
            const reviewStatus = await getComplianceReviewStatus();
            lastReviewAt = reviewStatus.lastReviewAt;
        } catch {
            // ok
        }
    }

    return (
        <ComplianceContent
            scores={scores}
            lastReviewAt={lastReviewAt}
            openReview={params.review === "true"}
        />
    );
}

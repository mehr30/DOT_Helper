import { getServerSession } from "../../../lib/session";
import { getComplianceScores } from "../../actions/compliance";
import { getComplianceReviewStatus } from "../../actions/company";
import { getSelections, getTestingStats } from "../../actions/drug-testing";
import ComplianceContent from "./ComplianceContent";

export default async function CompliancePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
    const session = await getServerSession();
    const params = await searchParams;
    let scores: Awaited<ReturnType<typeof getComplianceScores>> | null = null;
    let lastReviewAt: string | null = null;
    let testingData: { selections: Awaited<ReturnType<typeof getSelections>>; stats: Awaited<ReturnType<typeof getTestingStats>> } | null = null;

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
        try {
            const year = new Date().getFullYear();
            const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
            const currentPeriod = `${year}-Q${quarter}`;
            const [selections, stats] = await Promise.all([
                getSelections(currentPeriod),
                getTestingStats(),
            ]);
            testingData = { selections, stats };
        } catch {
            // ok
        }
    }

    return (
        <ComplianceContent
            scores={scores}
            lastReviewAt={lastReviewAt}
            openReview={params.review === "true"}
            testingData={testingData}
        />
    );
}

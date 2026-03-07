import { getServerSession } from "../../../lib/session";
import { getComplianceScores } from "../../actions/compliance";
import ComplianceContent from "./ComplianceContent";

export default async function CompliancePage() {
    const session = await getServerSession();
    let scores: Awaited<ReturnType<typeof getComplianceScores>> | null = null;

    if (session?.user) {
        try {
            scores = await getComplianceScores();
        } catch {
            // User may not have a company yet
        }
    }

    return <ComplianceContent scores={scores} />;
}

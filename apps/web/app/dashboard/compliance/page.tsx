import { getServerSession } from "../../../lib/session";
import { getComplianceScores } from "../../actions/compliance";
import { getCompanyForUser } from "../../actions/company";
import ComplianceContent from "./ComplianceContent";

export default async function CompliancePage() {
    const session = await getServerSession();
    let scores: Awaited<ReturnType<typeof getComplianceScores>> | null = null;
    let companyState: string | null = null;

    if (session?.user) {
        try {
            scores = await getComplianceScores();
        } catch {
            // User may not have a company yet
        }
        try {
            const company = await getCompanyForUser();
            companyState = company?.state ?? null;
        } catch {
            // ok
        }
    }

    return <ComplianceContent scores={scores} companyState={companyState} />;
}

import { getServerSession } from "../../../lib/session";
import { getReportData } from "../../actions/reports";
import ReportsContent from "./ReportsContent";

export default async function ReportsPage() {
    const session = await getServerSession();
    let reportData: Awaited<ReturnType<typeof getReportData>> | null = null;

    if (session?.user) {
        try {
            reportData = await getReportData();
        } catch {
            // User may not have a company yet
        }
    }

    return <ReportsContent data={reportData} />;
}

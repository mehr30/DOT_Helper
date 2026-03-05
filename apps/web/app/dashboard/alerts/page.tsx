import { getServerSession } from "../../../lib/session";
import { generateAlerts, getAlerts } from "../../actions/alerts";
import AlertsContent from "./AlertsContent";

export default async function AlertsPage() {
    const session = await getServerSession();
    let alerts: Awaited<ReturnType<typeof getAlerts>> = [];

    if (session?.user) {
        try {
            // Generate/refresh alerts from current data, then fetch them
            await generateAlerts();
            alerts = await getAlerts();
        } catch {
            // User may not have a company yet — show empty state
        }
    }

    return <AlertsContent alerts={alerts} />;
}

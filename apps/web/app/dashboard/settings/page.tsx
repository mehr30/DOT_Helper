import { getCompanyForUser } from "../../actions/company";
import SettingsContent from "./SettingsContent";

export default async function SettingsPage() {
    const company = await getCompanyForUser();
    return <SettingsContent company={company} />;
}

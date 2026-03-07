import { requireCompanyUser } from "../../../../lib/session";
import { getCompanyMembers, getCompanyInvites } from "../../../actions/invites";
import TeamManagement from "./TeamManagement";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
    const { userId, role } = await requireCompanyUser();
    const [members, invites] = await Promise.all([
        getCompanyMembers(),
        getCompanyInvites(),
    ]);

    return (
        <TeamManagement
            currentUserId={userId}
            currentUserRole={role}
            initialMembers={members}
            initialInvites={invites}
        />
    );
}

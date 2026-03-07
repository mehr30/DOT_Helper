import { getInviteByToken } from "../../actions/invites";
import InviteAcceptClient from "./InviteAcceptClient";

export const dynamic = "force-dynamic";

export default async function InviteAcceptPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const invite = await getInviteByToken(token);

    return <InviteAcceptClient token={token} invite={invite} />;
}

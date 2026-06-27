import { getSession } from "@/actions";
import LobbyTabs from "@/components/Lobby/LobbyTabs";
import { redirect } from "next/navigation";

const RoomPage = async ({ searchParams }) => {
  const uid = await getSession();
  if (!uid) redirect("/");

  const initialTab = searchParams?.tab === "tournament" ? "tournament" : "play";

  return <LobbyTabs currentUserId={uid} initialTab={initialTab} />;
};

export default RoomPage;

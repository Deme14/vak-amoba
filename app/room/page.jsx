import { getSession } from "@/actions";
import Lobby from "@/components/Tournament/Lobby";
import { redirect } from "next/navigation";

const RoomPage = async () => {
  const uid = await getSession();
  if (!uid) redirect("/");

  return <Lobby currentUserId={uid} />;
};

export default RoomPage;

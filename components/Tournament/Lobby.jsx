"use client";

import { useEnterMatch, useTournament, useUsersMap } from "@/hooks";
import Bracket from "./Bracket";

const Lobby = ({ currentUserId }) => {
  const { tournament, isLoading } = useTournament();
  const usersMap = useUsersMap();
  const enterMatch = useEnterMatch();

  const status = tournament?.status ?? "pending";

  if (isLoading) {
    return <p className="text-center text-zinc-400">Loading...</p>;
  }

  if (status === "pending") {
    return (
      <div className="rounded-md border border-zinc-700 p-8 text-center">
        <p className="text-lg font-semibold">The draw hasn&apos;t happened yet</p>
        <p className="mt-2 text-sm text-zinc-400">
          Please wait — the bracket will appear here once the organizer starts the
          tournament.
        </p>
      </div>
    );
  }

  return (
    <Bracket
      tournament={tournament}
      usersMap={usersMap}
      currentUserId={currentUserId}
      onEnter={enterMatch}
    />
  );
};

export default Lobby;

"use client";

import { signOut } from "@/actions";
import { useEnterMatch, useTournament, useUsersMap } from "@/hooks";
import Bracket from "./Bracket";

const Lobby = ({ currentUserId }) => {
  const { tournament, isLoading } = useTournament();
  const usersMap = useUsersMap();
  const enterMatch = useEnterMatch();

  const status = tournament?.status ?? "pending";
  const myName = usersMap[currentUserId];

  return (
    <div className="flex min-h-svh flex-col items-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <h1 className="text-center text-3xl font-bold">Tournament</h1>

        {myName && (
          <p className="mt-1 text-center text-sm text-zinc-400">
            You are <span className="font-semibold text-white">{myName}</span>
          </p>
        )}

        <div className="mt-8">
          {isLoading ? (
            <p className="text-center text-zinc-400">Loading...</p>
          ) : status === "pending" ? (
            <div className="rounded-md border border-zinc-700 p-8 text-center">
              <p className="text-lg font-semibold">
                The draw hasn&apos;t happened yet
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Please wait — the bracket will appear here once the organizer
                starts the tournament.
              </p>
            </div>
          ) : (
            <Bracket
              tournament={tournament}
              usersMap={usersMap}
              currentUserId={currentUserId}
              onEnter={enterMatch}
            />
          )}
        </div>

        <form action={signOut} className="mt-10">
          <button
            type="submit"
            className="w-full text-center text-sm text-zinc-400 hover:text-zinc-200"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;

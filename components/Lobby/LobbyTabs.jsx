"use client";

import { signOut } from "@/actions";
import { useUser } from "@/hooks";
import FreePlayLobby from "./FreePlayLobby";
import TournamentLobby from "@/components/Tournament/Lobby";
import { useState } from "react";

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      active
        ? "bg-purple-900 text-white"
        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
    }`}
  >
    {children}
  </button>
);

const LobbyTabs = ({ currentUserId, initialTab = "play" }) => {
  const [tab, setTab] = useState(initialTab);
  const me = useUser(currentUserId);

  return (
    <div className="flex min-h-svh flex-col items-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <h1 className="text-center text-3xl font-bold">Vak Amőba</h1>

        {me?.teamName && (
          <p className="mt-1 text-center text-sm text-zinc-400">
            You are{" "}
            <span className="font-semibold text-white">{me.teamName}</span>
          </p>
        )}

        <div className="mx-auto mt-6 flex max-w-sm gap-2">
          <TabButton active={tab === "play"} onClick={() => setTab("play")}>
            Free play
          </TabButton>
          <TabButton
            active={tab === "tournament"}
            onClick={() => setTab("tournament")}
          >
            Tournament
          </TabButton>
        </div>

        <div className="mt-8">
          {tab === "play" ? (
            <FreePlayLobby currentUserId={currentUserId} />
          ) : (
            <TournamentLobby currentUserId={currentUserId} />
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

export default LobbyTabs;

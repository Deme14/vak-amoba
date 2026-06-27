"use client";

import { adminLogout } from "@/actions";
import { useTournament, useTournamentActions, useUsersMap } from "@/hooks";
import Bracket from "@/components/Tournament/Bracket";
import { useState } from "react";

const Stat = ({ label, value }) => (
  <div className="rounded-md border border-zinc-700 bg-[#1c1c1c] px-3 py-2">
    <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
    <p className="mt-1 truncate text-lg font-semibold capitalize">{value}</p>
  </div>
);

const AdminPanel = () => {
  const { tournament } = useTournament();
  const usersMap = useUsersMap();
  const { draw, reset } = useTournamentActions();
  const [isWorking, setIsWorking] = useState(false);

  const teamCount = Object.keys(usersMap).length;
  const status = tournament?.status ?? "pending";

  const matches = Object.values(tournament?.matches ?? {});
  const totalMatches = matches.length;
  const decidedMatches = matches.filter((m) => m.winner).length;
  const championName = tournament?.champion
    ? usersMap[tournament.champion] ?? "…"
    : null;

  const handleDraw = async () => {
    if (
      !window.confirm(
        `Draw a new random bracket from ${teamCount} teams? This replaces any current tournament.`
      )
    )
      return;

    setIsWorking(true);
    await draw();
    setIsWorking(false);
  };

  const handleReset = async () => {
    if (!window.confirm("Reset the tournament and lock the lobby?")) return;

    setIsWorking(true);
    await reset();
    setIsWorking(false);
  };

  return (
    <div className="mx-auto min-h-svh max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Tournament admin</h1>
        <form action={adminLogout}>
          <button
            type="submit"
            className="text-sm text-zinc-400 hover:text-zinc-200"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Registered teams" value={teamCount} />
        <Stat label="Status" value={status} />
        <Stat
          label="Matches decided"
          value={`${decidedMatches}/${totalMatches}`}
        />
        <Stat label="Champion" value={championName ?? "—"} />
      </div>

      {status === "done" && championName && (
        <div className="mt-6 rounded-md border border-emerald-700 bg-emerald-950/40 p-5 text-center">
          <p className="text-sm text-zinc-300">Tournament result</p>
          <p className="mt-1 text-2xl md:text-3xl">
            🏆{" "}
            <span className="font-extrabold uppercase">{championName}</span>
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleDraw}
          disabled={isWorking || teamCount < 2}
          className="rounded-full bg-purple-900 px-6 py-2.5 font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
        >
          Draw bracket (random)
        </button>
        <button
          onClick={handleReset}
          disabled={isWorking || status === "pending"}
          className="rounded-full border border-zinc-600 px-6 py-2.5 font-semibold text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
        >
          Reset tournament
        </button>
      </div>

      {teamCount < 2 && (
        <p className="mt-3 text-sm text-zinc-400">
          At least 2 registered teams are needed to draw.
        </p>
      )}

      {status !== "pending" && tournament && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Current bracket</h2>
          <Bracket
            tournament={tournament}
            usersMap={usersMap}
            currentUserId={null}
            onEnter={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

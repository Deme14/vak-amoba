"use client";

const roundName = (round, totalRounds) => {
  const fromEnd = totalRounds - 1 - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semifinal";
  if (fromEnd === 2) return "Quarterfinal";
  return `Round ${round + 1}`;
};

const TeamRow = ({ name, isWinner, isMe }) => (
  <div
    className={`flex items-center justify-between gap-2 px-2 py-1.5 text-sm ${
      isWinner ? "font-bold text-white" : "text-zinc-300"
    }`}
  >
    <span className="truncate">
      {name}
      {isMe && <span className="ml-1 text-xs text-purple-400">(you)</span>}
    </span>
    {isWinner && <span className="text-emerald-400">✓</span>}
  </div>
);

const MatchCard = ({ match, usersMap, currentUserId, onEnter }) => {
  const label = (teamId) =>
    teamId ? usersMap[teamId] ?? "…" : match.winner ? "Bye" : "TBD";

  const ready = match.teamA && match.teamB && !match.winner;
  const iAmIn =
    currentUserId === match.teamA || currentUserId === match.teamB;

  return (
    <div className="rounded-md border border-zinc-700 bg-[#1c1c1c]">
      <TeamRow
        name={label(match.teamA)}
        isWinner={match.winner && match.winner === match.teamA}
        isMe={currentUserId === match.teamA}
      />
      <div className="border-t border-zinc-700" />
      <TeamRow
        name={label(match.teamB)}
        isWinner={match.winner && match.winner === match.teamB}
        isMe={currentUserId === match.teamB}
      />

      {ready && iAmIn && (
        <button
          onClick={() => onEnter(match)}
          className="w-full rounded-b-md bg-purple-900 py-1.5 text-xs font-semibold text-white hover:bg-purple-800"
        >
          Play
        </button>
      )}
    </div>
  );
};

const Bracket = ({ tournament, usersMap, currentUserId, onEnter }) => {
  const matches = Object.values(tournament.matches ?? {});

  if (matches.length === 0) {
    return <p className="text-center text-zinc-400">No bracket yet.</p>;
  }

  const totalRounds = Math.max(...matches.map((m) => m.round)) + 1;

  const rounds = Array.from({ length: totalRounds }, (_, r) =>
    matches
      .filter((m) => m.round === r)
      .sort((a, b) => a.slot - b.slot)
  );

  const myMatch = matches.find(
    (m) =>
      !m.winner &&
      m.teamA &&
      m.teamB &&
      (m.teamA === currentUserId || m.teamB === currentUserId)
  );

  const championName = tournament.champion
    ? usersMap[tournament.champion] ?? "…"
    : null;

  return (
    <div className="w-full">
      {championName && (
        <p className="mb-6 text-center text-2xl">
          🏆 Champion:{" "}
          <span className="font-extrabold uppercase">{championName}</span>
        </p>
      )}

      {myMatch && (
        <div className="mb-6 flex flex-col items-center gap-2 rounded-md border border-purple-700 bg-purple-950/40 p-4">
          <p className="text-sm text-zinc-300">Your match is ready</p>
          <p className="font-semibold">
            {usersMap[myMatch.teamA] ?? "…"} vs {usersMap[myMatch.teamB] ?? "…"}
          </p>
          <button
            onClick={() => onEnter(myMatch)}
            className="rounded-full bg-purple-700 px-6 py-2 font-semibold text-white hover:bg-purple-600"
          >
            Play now
          </button>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2">
        {rounds.map((roundMatches, r) => (
          <div
            key={r}
            className="flex min-w-[150px] flex-col justify-around gap-3"
          >
            <h4 className="text-center text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {roundName(r, totalRounds)}
            </h4>
            {roundMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                usersMap={usersMap}
                currentUserId={currentUserId}
                onEnter={onEnter}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bracket;

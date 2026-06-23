import { WINS_TO_FINISH } from "@/constants";

const badgeStyles = {
  x: "bg-purple-700",
  o: "bg-emerald-700",
  DRAW: "bg-zinc-600",
};

const badgeLabel = {
  x: "X",
  o: "O",
  DRAW: "–",
};

const Scoreboard = ({
  scoreX,
  scoreO,
  matchHistory = [],
  playerXName,
  playerOName,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl">
        <span className="font-bold">{playerXName ?? "X"}</span>
        <span className="tabular-nums">
          {scoreX} : {scoreO}
        </span>
        <span className="font-bold">{playerOName ?? "O"}</span>
      </div>

      <p className="text-xs text-zinc-400">
        First to {WINS_TO_FINISH} wins · {matchHistory.length} match
        {matchHistory.length === 1 ? "" : "es"} played
      </p>

      {matchHistory.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {matchHistory.map((result, index) => (
            <span
              key={index}
              title={`Match ${index + 1}`}
              className={`grid size-6 place-content-center rounded text-xs font-bold text-white ${
                badgeStyles[result] ?? "bg-zinc-600"
              }`}
            >
              {badgeLabel[result] ?? "?"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scoreboard;

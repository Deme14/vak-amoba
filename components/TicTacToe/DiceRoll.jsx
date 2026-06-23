"use client";

import { useState } from "react";

// Unicode dice faces, index 1-6.
const FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const Die = ({ value, animating, animFace, label }) => (
  <div className="flex flex-col items-center gap-2">
    <span className="text-sm text-zinc-400">{label}</span>
    <span className="text-6xl md:text-7xl leading-none select-none">
      {animating ? FACES[animFace] : value ? FACES[value] : "🎲"}
    </span>
  </div>
);

const DiceRoll = ({
  diceX,
  diceO,
  ownSign,
  playerXName,
  playerOName,
  onRoll,
  onReroll,
}) => {
  const [animating, setAnimating] = useState(false);
  const [animFace, setAnimFace] = useState(1);

  const ownValue = ownSign === "x" ? diceX : diceO;
  const hasRolled = ownValue != null;
  const bothRolled = diceX != null && diceO != null;
  const isTie = bothRolled && diceX === diceO;

  const handleRoll = async () => {
    if (animating || hasRolled || !ownSign) return;

    setAnimating(true);
    const interval = setInterval(
      () => setAnimFace(Math.floor(Math.random() * 6) + 1),
      80
    );

    await new Promise((resolve) => setTimeout(resolve, 700));
    clearInterval(interval);
    setAnimating(false);

    await onRoll(ownSign);
  };

  let status;
  if (isTie) {
    status = "It's a tie — roll again!";
  } else if (hasRolled && !bothRolled) {
    status = "Waiting for the other player...";
  } else if (!hasRolled) {
    status = "Roll to decide who starts";
  } else {
    status = "Rolling...";
  }

  return (
    <div className="my-auto flex flex-col items-center gap-8">
      <h2 className="text-2xl md:text-3xl">Highest roll starts</h2>

      <div className="flex items-center gap-8 md:gap-12">
        <Die
          value={diceX}
          animating={animating && ownSign === "x"}
          animFace={animFace}
          label={playerXName ?? "X"}
        />
        <Die
          value={diceO}
          animating={animating && ownSign === "o"}
          animFace={animFace}
          label={playerOName ?? "O"}
        />
      </div>

      <p className="text-zinc-300">{status}</p>

      {isTie ? (
        <button
          onClick={onReroll}
          className="px-6 py-3 rounded-full bg-purple-900 hover:bg-purple-800 text-white text-lg"
        >
          Roll again
        </button>
      ) : (
        ownSign &&
        !hasRolled && (
          <button
            onClick={handleRoll}
            disabled={animating}
            className="px-6 py-3 rounded-full bg-purple-900 hover:bg-purple-800 text-white text-lg disabled:opacity-60"
          >
            {animating ? "Rolling..." : "Roll the dice"}
          </button>
        )
      )}
    </div>
  );
};

export default DiceRoll;

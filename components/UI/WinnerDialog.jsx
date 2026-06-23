"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { WINS_TO_FINISH } from "@/constants";

const WinnerDialog = forwardRef(function WinnerDialog(
  {
    winner,
    scoreX,
    scoreO,
    seriesWinner,
    playerXUser,
    playerOUser,
    roomId,
    onNextRound,
    onBackToLobby,
  },
  ref
) {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialogRef.current?.showModal();
      },
      close() {
        dialogRef.current?.close();
      },
    };
  });

  const isSeriesDone = seriesWinner === "x" || seriesWinner === "o";

  const xName = playerXUser?.teamName ?? "X";
  const oName = playerOUser?.teamName ?? "O";

  const handleClick = () => {
    dialogRef.current?.close();
    if (isSeriesDone) {
      onBackToLobby(roomId);
    } else {
      onNextRound(roomId, winner);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="winner-dialog"
      onCancel={(event) => event.preventDefault()}
    >
      <div className="flex flex-col items-center gap-8 text-center">
        {isSeriesDone ? (
          <h2 className="text-4xl md:text-5xl">
            🏆{" "}
            <span className="font-extrabold uppercase">
              {seriesWinner === "x" ? xName : oName}
            </span>{" "}
            wins the series!
          </h2>
        ) : (
          <h2 className="text-4xl md:text-5xl">
            {winner === "DRAW" ? (
              "It's a draw!"
            ) : (
              <>
                <span className="font-extrabold uppercase">
                  {winner === "x" ? xName : oName}
                </span>{" "}
                won this round!
              </>
            )}
          </h2>
        )}

        <div className="text-2xl md:text-3xl">
          <span className="font-bold">{xName}</span> {scoreX} : {scoreO}{" "}
          <span className="font-bold">{oName}</span>
        </div>

        <p className="text-sm text-zinc-400">First to {WINS_TO_FINISH} wins</p>

        <button
          onClick={handleClick}
          className="px-6 py-3 rounded-full bg-purple-900 hover:bg-purple-800 text-white text-lg"
        >
          {isSeriesDone ? "Back to lobby" : "Next round"}
        </button>
      </div>
    </dialog>
  );
});

export default WinnerDialog;

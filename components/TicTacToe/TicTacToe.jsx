"use client";

import {
  useJoinRoom,
  useReset,
  useRoom,
  useUpdateBoard,
  useUser,
} from "@/hooks";
import { useRef } from "react";
import WinnerDialog from "../UI/WinnerDialog";
import Board from "./Board";
import XIcon from "../Icons/XIcon";
import CircleIcon from "../Icons/CircleIcon";

const TicTacToe = ({ roomId, user }) => {
  const winnerDialogRef = useRef(null);

  const openDialog = () => {
    if (!winnerDialogRef.current) return;

    winnerDialogRef.current.open();
  };
  const { room, isLoading } = useRoom(roomId);
  const { updateBoard, isUpdating } = useUpdateBoard(
    roomId,
    room,
    openDialog,
    user
  );
  const { resetBoard } = useReset();
  const { joinAs, isJoining } = useJoinRoom(roomId);
  const playerXUser = useUser(room?.playerX);
  const playerOUser = useUser(room?.playerO);

  if (!room) {
    return null;
  }

  const {
    board,
    playerTurn,
    winner,
    isGameDone,
    playerO,
    playerX,
    turnNumber,
  } = room;

  if (isLoading) {
    return (
      <div className="fixed inset-0 size-full pointer-events-none grid place-content-center bg-black/70">
        <h1 className="text-white text-7xl">Loading...</h1>
      </div>
    );
  }

  if (isUpdating) {
    <div className="fixed inset-0 size-full pointer-events-none grid place-content-center bg-black/70">
      <h1 className="text-white text-7xl">Waiting for other player...</h1>
    </div>;
  }

  if (isJoining) {
    <div className="fixed inset-0 size-full pointer-events-none grid place-content-center bg-black/70">
      <h1 className="text-white text-7xl">Joining to room...</h1>
    </div>;
  }

  return (
    <div className="text-center h-svh max-w-screen-sm m-auto flex flex-col justify-space-between items-center py-10 gap-10 md:gap-8">
      <h1 className="text-white text-5xl">
        {playerO && playerX ? "Let's play" : "Pick your sign"}
      </h1>

      {playerO && playerX && (
        <h3>
          {playerTurn === "x"
            ? playerXUser?.teamName + "'s"
            : playerOUser?.teamName + "'s"}{" "}
          turn
        </h3>
      )}

      {(!playerO || !playerX) && (
        <div className="my-auto flex flex-col items-center">
          <div className="grid grid-cols-3 items-center justify-items-center">
            <XIcon className="" />{" "}
            {playerX ? (
              <span className="col-start-3 font-semibold">
                {playerXUser?.teamName}
              </span>
            ) : (
              <button
                onClick={() => joinAs(user, "X")}
                className="px-4 py-2.5 bg-zinc-300 text-black rounded-full col-start-3"
              >
                Join as X
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 items-center justify-items-center">
            <CircleIcon className="size-[80px] md:size-[100px]" />{" "}
            {playerO ? (
              <span className="col-start-3 font-semibold">
                {playerOUser?.teamName}
              </span>
            ) : (
              <button
                onClick={() => joinAs(user, "O")}
                className="px-4 py-2.5 bg-zinc-300 text-black rounded-full col-start-3"
              >
                Join as O
              </button>
            )}
          </div>
        </div>
      )}

      {playerO && playerX && (
        <Board
          tiles={board}
          onTileClick={updateBoard}
          onReset={resetBoard}
          playerTurn={playerTurn}
          roomId={roomId}
          playerX={playerX}
          playerO={playerO}
          currentUserId={user}
          turnNumber={turnNumber}
        />
      )}

      {isGameDone && winner && (
        <WinnerDialog
          winner={winner}
          ref={winnerDialogRef}
          resetBoard={resetBoard}
          roomId={roomId}
          playerO={playerO}
          playerX={playerX}
        />
      )}
    </div>
  );
};

export default TicTacToe;

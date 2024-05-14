"use client";

import { useReset, useRoom, useUpdateBoard } from "@/hooks";
import { useRef } from "react";
import WinnerDialog from "../UI/WinnerDialog";
import Board from "./Board";

const TicTacToe = ({ roomId, user }) => {
  const winnerDialogRef = useRef(null);

  const openDialog = () => {
    if (!winnerDialogRef.current) return;

    winnerDialogRef.current.open();
  };
  const { room, isLoading } = useRoom(roomId);
  const { updateBoard, isUpdating } = useUpdateBoard(roomId, room, openDialog);
  const { resetBoard } = useReset();

  if (!room) {
    return null;
  }

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

  const { board, playerTurn, winner, isGameDone } = room;

  return (
    <div className="text-center max-w-screen-sm m-auto bg-[#242424]">
      <h1 className="text-white text-5xl mt-6 mb-10">Let&apos;s play </h1>

      <Board
        tiles={board}
        onTileClick={updateBoard}
        onReset={resetBoard}
        playerTurn={playerTurn}
        roomId={roomId}
      />

      {isGameDone && winner && (
        <WinnerDialog
          winner={winner}
          ref={winnerDialogRef}
          resetBoard={resetBoard}
          roomId={roomId}
        />
      )}
    </div>
  );
};

export default TicTacToe;

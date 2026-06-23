"use client";

import {
  useJoinRoom,
  useReset,
  useRollDice,
  useRoom,
  useTournamentActions,
  useUpdateBoard,
  useUser,
} from "@/hooks";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import WinnerDialog from "../UI/WinnerDialog";
import Scoreboard from "./Scoreboard";
import DiceRoll from "./DiceRoll";
import Board from "./Board";
import XIcon from "../Icons/XIcon";
import CircleIcon from "../Icons/CircleIcon";

const TicTacToe = ({ roomId, user }) => {
  const winnerDialogRef = useRef(null);
  const wasPlayerRef = useRef(false);
  const router = useRouter();

  const { room, isLoading } = useRoom(roomId);
  const { updateBoard, isUpdating, occupiedTile } = useUpdateBoard(
    roomId,
    room,
    user
  );
  const { nextRound, resetRoom } = useReset();
  const { reportMatchWinner } = useTournamentActions();
  const { roll, startWith, rerollDice } = useRollDice(roomId);
  const { joinAs, isJoining } = useJoinRoom(roomId);
  const playerXUser = useUser(room?.playerX);
  const playerOUser = useUser(room?.playerO);

  // Open the result dialog whenever a round ends. When the next round starts
  // (winner back to "NONE") the dialog unmounts and closes on its own.
  useEffect(() => {
    if (room?.winner && room.winner !== "NONE") {
      winnerDialogRef.current?.open();
    }
  }, [room?.winner]);

  // Resolve the dice roll once both players have rolled. Idempotent, so it is
  // fine for both clients to run it; a tie is left for the UI to re-roll.
  useEffect(() => {
    if (!room) return;

    const { playerX, playerO, playerTurn, isGameDone, diceX, diceO } = room;

    if (!playerX || !playerO || isGameDone) return;
    if (playerTurn != null) return;
    if (diceX == null || diceO == null || diceX === diceO) return;

    startWith(diceX > diceO ? "x" : "o");
  }, [room, startWith]);

  // Once you were a player but no longer are (e.g. the series ended and the room
  // was released back to the lobby), send yourself back to the lobby.
  useEffect(() => {
    if (!room) return;

    const isPlayer = user === room.playerX || user === room.playerO;

    if (isPlayer) {
      wasPlayerRef.current = true;
    } else if (wasPlayerRef.current) {
      router.push("/room");
    }
  }, [room, user, router]);

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
    diceX,
    diceO,
    matchId,
    scoreX = 0,
    scoreO = 0,
    seriesWinner = "NONE",
    matchHistory = [],
  } = room;

  // End of series. For a tournament match, report the winner to the bracket
  // first so it advances; then release the room and head back to the lobby.
  const handleBackToLobby = async (rid) => {
    if (matchId && (seriesWinner === "x" || seriesWinner === "o")) {
      const winnerUserId = seriesWinner === "x" ? playerX : playerO;
      await reportMatchWinner(matchId, winnerUserId);
    }
    await resetRoom(rid);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 size-full pointer-events-none grid place-content-center bg-black/70">
        <h1 className="text-white text-4xl md:text-7xl">Loading...</h1>
      </div>
    );
  }

  const bothPlayersReady = playerO && playerX;
  const needsRoll = bothPlayersReady && !isGameDone && playerTurn == null;
  const isPlaying = bothPlayersReady && playerTurn != null;

  const ownSign = user === playerX ? "x" : user === playerO ? "o" : null;
  const ownTeamName =
    ownSign === "x"
      ? playerXUser?.teamName
      : ownSign === "o"
      ? playerOUser?.teamName
      : null;
  const opponentName =
    playerTurn === "x" ? playerXUser?.teamName : playerOUser?.teamName;

  return (
    <div className="text-center min-h-svh max-w-screen-sm m-auto flex flex-col justify-center items-center px-4 py-6 md:py-10 gap-4 md:gap-6">
      {(isUpdating || isJoining) && (
        <div className="fixed inset-0 size-full pointer-events-none grid place-content-center bg-black/70 z-10 px-4 text-center">
          <h1 className="text-white text-4xl md:text-7xl">
            {isJoining ? "Joining to room..." : "Waiting for other player..."}
          </h1>
        </div>
      )}

      <h1 className="text-white text-3xl md:text-5xl">
        {bothPlayersReady ? "Let's play" : "Pick your sign"}
      </h1>

      {ownTeamName && (
        <p className="text-sm text-zinc-400">
          You are{" "}
          <span className="font-semibold text-white">{ownTeamName}</span> (
          {ownSign.toUpperCase()})
        </p>
      )}

      {bothPlayersReady && (
        <Scoreboard
          scoreX={scoreX}
          scoreO={scoreO}
          matchHistory={matchHistory}
          playerXName={playerXUser?.teamName}
          playerOName={playerOUser?.teamName}
        />
      )}

      {isPlaying && (
        <h3>
          {playerTurn === ownSign ? "Your turn" : `${opponentName}'s turn`}
        </h3>
      )}

      {!bothPlayersReady && (
        <div className="my-auto flex w-full max-w-xs flex-col items-center gap-4">
          <div className="grid w-full grid-cols-3 items-center justify-items-center">
            <XIcon className="size-16 md:size-24" />{" "}
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
          <div className="grid w-full grid-cols-3 items-center justify-items-center">
            <CircleIcon className="size-16 md:size-24" />{" "}
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

      {needsRoll && (
        <DiceRoll
          diceX={diceX}
          diceO={diceO}
          ownSign={ownSign}
          playerXName={playerXUser?.teamName}
          playerOName={playerOUser?.teamName}
          onRoll={roll}
          onReroll={rerollDice}
        />
      )}

      {isPlaying && (
        <Board
          tiles={board}
          onTileClick={updateBoard}
          playerTurn={playerTurn}
          playerX={playerX}
          playerO={playerO}
          currentUserId={user}
          occupiedTile={occupiedTile}
        />
      )}

      {isGameDone && (
        <WinnerDialog
          ref={winnerDialogRef}
          winner={winner}
          scoreX={scoreX}
          scoreO={scoreO}
          seriesWinner={seriesWinner}
          playerXUser={playerXUser}
          playerOUser={playerOUser}
          roomId={roomId}
          onNextRound={nextRound}
          onBackToLobby={handleBackToLobby}
        />
      )}
    </div>
  );
};

export default TicTacToe;

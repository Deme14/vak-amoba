"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import XIcon from "../Icons/XIcon";
import { useUser } from "@/hooks";

const WinnerDialog = forwardRef(function WinnerDialog(
  { winner, resetBoard, roomId, playerX, playerO },
  ref
) {
  const dialogRef = useRef(null);
  const winnerId =
    winner === "DRAW" ? null : winner === "x" ? playerX : playerO;

  const winnerUser = useUser(winnerId);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialogRef.current.showModal();
      },
    };
  });

  const handleClose = () => {
    dialogRef.current.close();
    resetBoard(roomId);
  };

  return (
    <dialog ref={dialogRef} className="winner-dialog">
      <h2 className="text-5xl">
        {winner === "x" || winner === "o" ? "The winner is: " : "It's a "}
        <span className="font-extrabold uppercase">
          {winner === "DRAW" ? "draw" : winnerUser?.teamName}
        </span>
        !
      </h2>

      <button
        onClick={handleClose}
        className="w-fit aspect-square p-2.5 rounded-full flex items-center justify-center absolute top-6 right-6 border border-white"
      >
        <XIcon className="size-10" />
      </button>
    </dialog>
  );
});

export default WinnerDialog;

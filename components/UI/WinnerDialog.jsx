"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import XIcon from "../Icons/XIcon";

const WinnerDialog = forwardRef(function WinnerDialog(
  { winner, resetBoard, roomId },
  ref
) {
  const dialogRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialogRef.current.showModal();
      },
    };
  });

  const handleClose = () => {
    resetBoard(roomId);
    dialogRef.current.close();
  };

  return (
    <dialog ref={dialogRef} className="winner-dialog">
      <h2 className="text-5xl">
        {winner === "x" || winner === "o" ? "The winner is: " : "It's a "}
        <span className="font-extrabold uppercase">
          {winner === "DRAW" ? "draw" : winner}
        </span>
        !
      </h2>

      <button
        className="w-fit aspect-square p-2.5 rounded-full flex items-center justify-center absolute top-6 right-6 border border-white"
        onClick={handleClose}
      >
        <XIcon className="size-10" />
      </button>
    </dialog>
  );
});

export default WinnerDialog;

import { PLAYER_O, PLAYER_X, WINNING_COMBINATIONS } from "@/constants";

export const checkWinner = (tiles, turnNumber) => {
  for (const { combo } of WINNING_COMBINATIONS) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (turnNumber >= 5) {
      if (
        tileValue1 !== null &&
        tileValue1 === tileValue2 &&
        tileValue1 === tileValue3
      ) {
        if (tileValue1 === PLAYER_X) {
          return PLAYER_X;
        } else {
          return PLAYER_O;
        }
      }
    }

    if (turnNumber >= 9) {
      return "DRAW";
    }
  }

  return "NONE";
};

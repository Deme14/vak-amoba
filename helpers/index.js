import { PLAYER_O, PLAYER_X, WINNING_COMBINATIONS } from "@/constants";

export const checkWinner = (tiles, turnNumber) => {
  // A win is only possible once a player has placed at least 3 marks.
  if (turnNumber >= 5) {
    for (const { combo } of WINNING_COMBINATIONS) {
      const tileValue1 = tiles[combo[0]];
      const tileValue2 = tiles[combo[1]];
      const tileValue3 = tiles[combo[2]];

      if (
        tileValue1 !== null &&
        tileValue1 === tileValue2 &&
        tileValue1 === tileValue3
      ) {
        return tileValue1 === PLAYER_X ? PLAYER_X : PLAYER_O;
      }
    }
  }

  // Only declare a draw once every combination has been checked and the
  // board is full.
  if (turnNumber >= 9) {
    return "DRAW";
  }

  return "NONE";
};

// Fisher-Yates shuffle (returns a new array).
export const shuffle = (array) => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Builds a single-elimination bracket from a list of team ids. Teams are
// randomly shuffled; if the count is not a power of two, the leftover teams get
// byes in round 0 (auto-advanced). Returns { status, matches, champion } where
// matches is a map keyed by match id so individual matches can be updated with
// Firestore dot-paths.
export const buildBracket = (teamIds) => {
  const teams = shuffle(teamIds);
  const n = teams.length;

  if (n < 2) {
    return { status: "pending", matches: {}, champion: null };
  }

  const size = 2 ** Math.ceil(Math.log2(n)); // next power of two
  const rounds = Math.log2(size);
  const matches = {};

  for (let r = 0; r < rounds; r++) {
    const count = size / 2 ** (r + 1);
    for (let m = 0; m < count; m++) {
      const isLast = r === rounds - 1;
      matches[`r${r}m${m}`] = {
        id: `r${r}m${m}`,
        round: r,
        slot: m,
        teamA: null,
        teamB: null,
        winner: null,
        nextMatchId: isLast ? null : `r${r + 1}m${Math.floor(m / 2)}`,
        nextSlot: isLast ? null : m % 2 === 0 ? "A" : "B",
      };
    }
  }

  const firstRoundCount = size / 2;
  const byes = size - n;

  // Seed teams: the first `byes` matches get a single team (a bye), the rest
  // get two. The list is already shuffled, so this is a random draw.
  let t = 0;
  for (let m = 0; m < firstRoundCount; m++) {
    const match = matches[`r0m${m}`];
    match.teamA = teams[t++] ?? null;
    if (m >= byes) {
      match.teamB = teams[t++] ?? null;
    }
  }

  // Auto-advance byes into the next round.
  for (let m = 0; m < firstRoundCount; m++) {
    const match = matches[`r0m${m}`];
    if (match.teamA && !match.teamB) {
      match.winner = match.teamA;
      if (match.nextMatchId) {
        const slotField = match.nextSlot === "A" ? "teamA" : "teamB";
        matches[match.nextMatchId][slotField] = match.teamA;
      }
    }
  }

  return { status: "active", matches, champion: null };
};

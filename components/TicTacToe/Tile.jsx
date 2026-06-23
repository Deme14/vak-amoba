import CircleIcon from "@/components/Icons/CircleIcon";
import XIcon from "@/components/Icons/XIcon";

const renderSign = (sign, className) =>
  sign === "x" ? (
    <XIcon className={className} />
  ) : (
    <CircleIcon className={className} />
  );

const Tile = ({
  value,
  onClick,
  playerTurn,
  playerX,
  playerO,
  currentUserId,
  isOccupiedHint,
}) => {
  // The sign the current player is allowed to see/place.
  const ownSign =
    currentUserId === playerX ? "x" : currentUserId === playerO ? "o" : null;

  // Blind amőba: a tile is only revealed if it belongs to the current player.
  // The opponent's marks stay hidden, so they look like empty tiles.
  const visibleValue = value === ownSign ? value : null;

  const isMyTurn = ownSign !== null && playerTurn === ownSign;
  const showHoverPreview = visibleValue === null && isMyTurn;

  return (
    <div
      className={`group relative w-full aspect-square flex items-center justify-center text-white ${
        visibleValue === null ? "cursor-pointer" : "cursor-not-allowed"
      } ${isOccupiedHint ? "occupied-flash" : "bg-[#242424]"}`}
      onClick={onClick}
    >
      {visibleValue && renderSign(visibleValue, "w-3/5 h-3/5")}

      {/* Hover preview of your own mark (desktop only — uses the same icon, so
          it lines up exactly with where the mark will be placed). */}
      {showHoverPreview &&
        renderSign(
          ownSign,
          "w-3/5 h-3/5 opacity-0 transition-opacity group-hover:opacity-30"
        )}
    </div>
  );
};

export default Tile;

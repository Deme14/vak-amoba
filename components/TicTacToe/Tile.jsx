import CircleIcon from "@/components/Icons/CircleIcon";
import XIcon from "@/components/Icons/XIcon";

const Tile = ({
  value,
  onClick,
  playerTurn,
  playerX,
  playerO,
  currentUserId,
}) => {
  const icon =
    value !== null ? (
      value === "x" ? (
        <XIcon />
      ) : (
        <CircleIcon className="size-[80px] md:size-[100px]" />
      )
    ) : null;

  let hoverClass;

  if (value !== null) {
    hoverClass = "hover:after:hidden";
  }

  if (value === null && playerTurn === "x" && currentUserId === playerX) {
    hoverClass = "hover:after:content-xIcon";
  }

  if (value === null && playerTurn === "o" && currentUserId === playerO) {
    hoverClass = "hover:after:content-circleIcon";
  }

  return (
    <div
      className={`min-w-[100px] md:min-w-[200px] aspect-square bg-[#242424] flex items-center justify-center text-white hover:after:invert hover:after:opacity-30 hover:after:size-[100px] ${hoverClass} ${
        value === null ? "cursor-pointer" : "cursor-not-allowed"
      }`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default Tile;

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
    value !== null ? value === "x" ? <XIcon /> : <CircleIcon /> : null;

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
      className={`min-w-[200px] aspect-square bg-[#242424] cursor-pointer flex items-center justify-center text-white hover:after:invert hover:after:opacity-30 hover:after:size-[100px] ${hoverClass}`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default Tile;

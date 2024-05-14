import CircleIcon from "@/components/Icons/CircleIcon";
import XIcon from "@/components/Icons/XIcon";

const Tile = ({ value, onClick, playerTurn }) => {
  const icon =
    value !== null ? value === "x" ? <XIcon /> : <CircleIcon /> : null;

  return (
    <div
      className={`min-w-[200px] aspect-square bg-[#242424] cursor-pointer flex items-center justify-center text-white hover:after:invert hover:after:opacity-30 hover:after:size-[100px] ${
        value === null
          ? playerTurn === "x"
            ? "hover:after:content-xIcon"
            : "hover:after:content-circleIcon"
          : "hover:after:hidden"
      }`}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default Tile;

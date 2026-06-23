import Tile from "./Tile";

const Board = ({
  tiles,
  onTileClick,
  playerTurn,
  playerX,
  playerO,
  currentUserId,
  occupiedTile,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3 bg-white m-auto overflow-hidden w-[min(90vw,460px)]">
      {tiles?.map((tile, index) => {
        return (
          <Tile
            key={index}
            value={tile}
            onClick={() => onTileClick(index)}
            playerTurn={playerTurn}
            playerO={playerO}
            playerX={playerX}
            currentUserId={currentUserId}
            isOccupiedHint={occupiedTile === index}
          />
        );
      })}
    </div>
  );
};

export default Board;

import Tile from "./Tile";

const Board = ({
  tiles,
  onTileClick,
  onReset,
  playerTurn,
  roomId,
  playerX,
  playerO,
  currentUserId,
  turnNumber,
}) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-2 md:gap-3 bg-white m-auto">
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
            />
          );
        })}
      </div>
      {turnNumber >= 9 && (
        <button
          className="w-fit px-5 py-3 text-white text-lg border border-white rounded-md"
          onClick={() => onReset(roomId)}
        >
          Reset
        </button>
      )}
    </>
  );
};

export default Board;

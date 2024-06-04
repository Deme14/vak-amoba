import { createBoard } from "@/actions";

const RoomPage = ({ searchParams }) => {
  return (
    <div>
      <h2>Create/join room</h2>
      <form action={createBoard.bind(null, searchParams.user)}>
        <label htmlFor="roomName">Room name</label>
        <input type="text" name="roomName" id="roomName" />
        <button type="submit">Create/join</button>
      </form>
    </div>
  );
};

export default RoomPage;

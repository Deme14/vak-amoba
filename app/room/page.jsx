import { firestore } from "@/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

const createBoard = async (user, data) => {
  "use server";
  const collRef = collection(firestore, "rooms");

  const roomName = data.get("roomName");
  if (!roomName) return;

  const roomNameToHyphenated = roomName.split(" ").join("-");

  const roomDoc = await getDoc(doc(collRef, roomNameToHyphenated));

  if (!roomDoc.exists()) {
    await setDoc(doc(collRef, roomNameToHyphenated), {
      name: roomName,
      board: Array(9).fill(null),
      isGameDone: false,
      turnNumber: 1,
      winner: "",
      playerTurn: "x",
    });

    const roomRef = doc(collRef, roomNameToHyphenated);

    redirect(`/room/${roomRef.id}?user=${user}`);
  } else {
    redirect(`/room/${roomDoc.id}?user=${user}`);
  }
};

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

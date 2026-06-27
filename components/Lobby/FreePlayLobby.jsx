"use client";

import { createBoard } from "@/actions";
import RoomList from "./RoomList";

const FreePlayLobby = ({ currentUserId }) => {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div>
        <h3 className="mb-3 text-center text-lg font-semibold">Rooms</h3>
        <RoomList currentUserId={currentUserId} />
      </div>

      <div className="my-10 border-t border-zinc-700" />

      <div>
        <h3 className="mb-3 text-center text-lg font-semibold">
          Create a new room
        </h3>

        <form className="space-y-6" action={createBoard}>
          <div>
            <label
              htmlFor="roomName"
              className="block text-sm font-medium leading-6"
            >
              Room name
            </label>
            <div className="mt-2">
              <input
                id="roomName"
                name="roomName"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-900 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-purple-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
            >
              Create room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FreePlayLobby;

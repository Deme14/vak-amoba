"use client";

import { firestore } from "@/firebase";
import { useUsersMap } from "@/hooks";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const RoomList = ({ currentUserId }) => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const usersMap = useUsersMap();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "rooms"),
      (snapshot) => {
        setRooms(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rooms
      // Tournament match rooms are managed by the bracket, not free play.
      .filter((room) => !room.matchId && !room.id.startsWith("match-"))
      .filter((room) => (room.name ?? room.id).toLowerCase().includes(term))
      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
  }, [rooms, search]);

  return (
    <div className="w-full">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search rooms..."
        className="block w-full rounded-md border-0 py-1.5 px-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-900 sm:text-sm sm:leading-6"
      />

      <ul className="mt-4 space-y-2">
        {filtered.length === 0 && (
          <li className="text-center text-sm text-zinc-400">No rooms found.</li>
        )}

        {filtered.map((room) => {
          const playerCount = (room.playerX ? 1 : 0) + (room.playerO ? 1 : 0);
          const isFull = playerCount === 2;
          const isMine =
            !!currentUserId &&
            (room.playerX === currentUserId || room.playerO === currentUserId);
          const canEnter = !isFull || isMine;

          const xName = room.playerX ? usersMap[room.playerX] ?? "…" : null;
          const oName = room.playerO ? usersMap[room.playerO] ?? "…" : null;

          let statusText;
          if (xName && oName) statusText = `${xName} vs ${oName} · in game`;
          else if (xName || oName)
            statusText = `${xName ?? oName} · waiting for opponent`;
          else statusText = "Empty · waiting";

          return (
            <li
              key={room.id}
              className="flex items-center justify-between gap-3 rounded-md border border-zinc-700 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{room.name ?? room.id}</p>
                <p className="truncate text-xs text-zinc-400">{statusText}</p>
              </div>

              {canEnter ? (
                <Link
                  href={`/room/${room.id}`}
                  className="shrink-0 rounded-full bg-purple-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-purple-800"
                >
                  {isMine ? "Re-enter" : "Join"}
                </Link>
              ) : (
                <span className="shrink-0 cursor-not-allowed rounded-full bg-zinc-700 px-4 py-1.5 text-sm text-zinc-400">
                  Full
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RoomList;

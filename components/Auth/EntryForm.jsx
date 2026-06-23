"use client";

import { createSession } from "@/actions";
import { firestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

const EntryForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const teamName = new FormData(event.currentTarget)
      .get("team")
      ?.toString()
      .trim();

    if (!teamName) return;

    try {
      setIsLoading(true);
      setError(null);

      // No accounts — just a random id tied to the chosen team name.
      const uid = crypto.randomUUID();

      await setDoc(doc(firestore, "users", uid), { teamName }, { merge: true });

      // Persist the session in a cookie and move on to the rooms page.
      await createSession(uid);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Pick a team name
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          No email or password needed.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="team" className="block text-sm font-medium leading-6">
              Team name
            </label>
            <div className="mt-2">
              <input
                id="team"
                name="team"
                type="text"
                required
                maxLength={30}
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-900 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-purple-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-900 disabled:opacity-60"
            >
              {isLoading ? "Starting..." : "Start playing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;

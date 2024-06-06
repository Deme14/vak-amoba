import { createBoard } from "@/actions";

const RoomPage = ({ searchParams }) => {
  return (
    <>
      <div class="flex min-h-svh flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">
            Create/Join room
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            class="space-y-6"
            action={createBoard.bind(null, searchParams.user)}
          >
            <div>
              <label
                for="roomName"
                class="block text-sm font-medium leading-6 "
              >
                Room name
              </label>
              <div class="mt-2">
                <input
                  id="roomName"
                  name="roomName"
                  type="text"
                  required
                  class="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-900 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-purple-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RoomPage;

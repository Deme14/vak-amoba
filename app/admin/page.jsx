import { adminLogin, getSession, isAdmin } from "@/actions";
import AdminPanel from "@/components/Admin/AdminPanel";
import { redirect } from "next/navigation";

export default async function AdminPage({ searchParams }) {
  const uid = await getSession();
  if (!uid) redirect("/");

  if (await isAdmin()) {
    return <AdminPanel />;
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-4">
      <h1 className="text-center text-2xl font-bold">Admin access</h1>

      <form action={adminLogin} className="mt-6 space-y-4">
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Password"
          className="block w-full rounded-md border-0 py-1.5 px-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-900 sm:text-sm sm:leading-6"
        />

        {searchParams?.error && (
          <p className="text-sm text-red-400">Wrong password.</p>
        )}

        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-purple-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-800"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

import { getSession } from "@/actions";
import AdminPanel from "@/components/Admin/AdminPanel";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const uid = await getSession();
  if (!uid) redirect("/");

  return <AdminPanel />;
}

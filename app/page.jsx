import EntryForm from "@/components/Auth/EntryForm";
import { getSession } from "@/actions";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const uid = await getSession();
  if (uid) redirect("/room");

  return <EntryForm />;
};

export default HomePage;

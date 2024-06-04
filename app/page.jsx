import Link from "next/link";

const HomePage = () => {
  return (
    <div className="w-full h-svh flex flex-col gap-6 items-center justify-center">
      <Link
        href={"/login"}
        className="text-white px-4 py-2 bg-purple-900 rounded-full w-32 text-center"
      >
        Login
      </Link>
      <Link
        href={"/signup"}
        className="text-white px-4 py-2 bg-purple-900 rounded-full w-32 text-center"
      >
        Sign up
      </Link>
    </div>
  );
};

export default HomePage;

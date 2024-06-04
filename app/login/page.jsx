import { signIn } from "@/actions";

const LoginPage = () => {
  return (
    <div className="w-full h-svh grid place-content-center">
      <form
        action={signIn}
        className="flex flex-col gap-6 items-center justify-center text-white"
      >
        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="font-semibold">
            Email:{" "}
          </label>
          <input type="email" name="email" id="email" className="text-black" />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="password" className="font-semibold">
            password:{" "}
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="text-black"
          />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default LoginPage;

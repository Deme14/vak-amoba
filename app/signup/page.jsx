import { signUp } from "@/actions";

const SignUpPage = () => {
  return (
    <div className="w-full h-svh grid place-content-center">
      <form
        action={signUp}
        className="flex flex-col gap-6 items-center justify-center text-white"
      >
        <div className="flex flex-col gap-3">
          <label htmlFor="team" className="font-semibold">
            Team name:
          </label>
          <input type="text" name="team" id="team" className="text-black" />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="font-semibold">
            Email:
          </label>
          <input type="email" name="email" id="email" className="text-black" />
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="password" className="font-semibold">
            Password:
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

export default SignUpPage;

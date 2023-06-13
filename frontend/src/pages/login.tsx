import { useRef } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleClick = (e: any) => {
    e.preventDefault();
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    loginHandler(username, password);
  };

  const loginHandler = (username: string, password: string) => {
    console.log("pressed");
    fetch("http://localhost:8081/login", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.text();
      })
      .then((data) => {
        try {
          const token: string = JSON.parse(data).token;
          console.log(token);
        } catch (error) {
          console.log(error);
        }
        // redirect to Overview Page

        router.push("/overview");
      })
      .catch((error) => {
        console.error(error);
        window.alert(
          "Login failed. Please check your username and password and try again."
        );
      });
  };

  return (
    <div className="h-screen flex">
      <div className="w-full max-w-2xl m-auto bg-white rounded-lg border py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          SEATTLE BUILDING DATA VISUALIZATION
        </h1>
        <form>
          <div className="flex-row flex items-center justify-center">
            <label className="w-[20%]" htmlFor="username">
              Username
            </label>
            <input
              type="string"
              className={`w-[70%] p-2 border rounded-md outline-none text-sm ml-2`}
              placeholder="Your Username"
              ref={usernameRef}
            />
          </div>
          <div className="my-2 flex-row flex items-center justify-center">
            <label className="w-[20%]" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className={`w-[70%] p-2 border rounded-md outline-none text-sm ml-2`}
              placeholder="Your Password"
              ref={passwordRef}
            />
          </div>
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={handleClick}
              className={` bg-red-400 w-[30%] py-2 px-4 text-sm text-black border border-black border-w-1 rounded-md`}
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

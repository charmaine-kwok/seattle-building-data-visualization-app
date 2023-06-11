import { useRef } from "react";
import { useRouter } from "next/router";
import jwtAtom from "@/atoms/jwtAtom";
import { useSetAtom } from "jotai";

const Login = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const setJwtAtom = useSetAtom(jwtAtom);

  const handleClick = (e: any) => {
    e.preventDefault();
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    loginHandler(username, password);
  };
  console.log("Login Page");
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
          setJwtAtom(token);
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
    <div className="h-screen flex bg-gray-bg1">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Log in to your account 🔐
        </h1>
        <form>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="string"
              className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
              placeholder="Your Username"
              ref={usernameRef}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={`w-full p-2 border rounded-md outline-none text-sm  mb-4`}
              placeholder="Your Password"
              ref={passwordRef}
            />
          </div>
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={handleClick}
              className={` bg-green-400 py-2 px-4 text-sm text-black rounded hover:bg-green-300`}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

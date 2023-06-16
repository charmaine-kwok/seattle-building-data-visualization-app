import { useRouter } from "next/router";

const ErrorPage = () => {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center space-x-10 h-[100vh]">
      <p>Unauthorized, please log in</p>
      <button
        onClick={redirectToLogin}
        className="border border-black px-4 py-2"
      >
        Press to redirect to login page
      </button>
    </div>
  );
};

export default ErrorPage;

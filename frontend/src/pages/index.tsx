import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  // Redirect to /login
  useEffect(() => {
    router.push("/login");
  }, []);

  return null;
}

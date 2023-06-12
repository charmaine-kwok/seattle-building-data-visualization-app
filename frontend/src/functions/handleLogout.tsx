import { NextRouter } from "next/router";

const handleLogout = (router: NextRouter) => {
  router.push("/login");
  fetch(`http://localhost:8081/logout`, {
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Failed to fetch buildings data: ${response.status} ${response.statusText}`
      );
    }
    return response;
  });
};

export default handleLogout;

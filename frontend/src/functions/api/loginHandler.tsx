const loginHandler = async (
  username: string,
  password: string,
  toOverview: () => void
) => {
  try {
    const response = await fetch("http://localhost:8081/login", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error("Login failed");
    }
    const data = await response.json();
    const token: string = data.token;
    // redirect to Overview page on successful login
    toOverview();
  } catch (error) {
    console.error(error);
    window.alert(
      "Login failed. Please check your username and password and try again."
    );
  }
};

export default loginHandler;

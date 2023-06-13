const handleLogout = async (toLoginPage: () => void) => {
  try {
    toLoginPage();
    const response = await fetch(`http://localhost:8081/logout`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch buildings data: ${response.status} ${response.statusText}`
      );
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default handleLogout;

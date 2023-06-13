import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Header from "@/components/header";
import SignOutButton from "@/components/SignOutButton";
import Loading from "@/components/Loading";
import BarChart from "@/components/BarChart";
import handleLogout from "@/functions/handleLogout";

export default function Chart() {
  const router = useRouter();

  const logoutHandler = () => {
    handleLogout(router);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [averageData, setAverageData] = useState(null);

  const fetchAverageData = () => {
    setIsLoading(true);

    fetch("http://localhost:8081/average", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        setAverageData(data);
      })
      .catch((error) => {
        window.alert("Failed to fetch buildings data. Please login again.");
      });
  };

  useEffect(() => {
    fetchAverageData();
  }, []);

  return (
    <div className="flex flex-col items-center py-4 h-screen">
      <Header
        page="charts"
        onClickOverview={() => {
          router.push("/overview");
        }}
      />
      <div className="h-[500px] w-[80%]">
        {isLoading && <Loading />}
        {averageData != null && <BarChart data={averageData} />}
      </div>
      <SignOutButton logoutHandler={logoutHandler} />
    </div>
  );
}

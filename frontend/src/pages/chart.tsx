import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Loading from "@/components/Loading";
import BarChart from "@/components/BarChart";
import { handleLogout } from "./overview";

export default function Chart() {
  const router = useRouter();

  const logoutHandler = () => {
    handleLogout(router);
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [averageData, setAverageData] = useState(null);

  const fetchBuildings = () => {
    setIsLoading(true);
    setTimeout(
      () =>
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
            console.log(data);
            setAverageData(data);
          })
          .catch((error) => {
            console.error(error);
            window.alert("Failed to fetch buildings data");
          }),
      2000
    );
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  return (
    <div className="flex flex-col items-center py-4 h-screen">
      <div className="flex flex-row w-full items-center justify-center">
        <h1 className="text-3xl font-bold my-4">
          SEATTLE BUILDING DATA VISUALIZATION
        </h1>
        <div className="flex w-[20%] space-x-3 mx-4">
          <button
            className={"w-24 border boder-w-1 border-black box-border"}
            onClick={() => {
              router.push("/overview");
            }}
          >
            overview
          </button>
          <button
            className={
              "w-24 border boder-w-1 border-black bg-blue-300 box-border"
            }
          >
            charts
          </button>
        </div>
      </div>
      <div className="h-[500px] w-[80%]">
        {isLoading && <Loading />}
        {averageData != null && <BarChart data={averageData} />}
      </div>
      <button
        className="fixed bottom-10 left-10 bg-red-500 border border-black px-4 py-2"
        onClick={logoutHandler}
      >
        SIGN OUT
      </button>
    </div>
  );
}

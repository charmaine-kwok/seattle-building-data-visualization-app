import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import Loading from "@/components/Loading";
import { setTimeout } from "timers";
import Map from "@/components/Map";

interface BuildingsProps {
  PropertyName: string;
  PrimaryPropertyType: string;
  Address: string;
  City: string;
  NumberofFloors: number;
  CouncilDistrictCode: number;
  YearBuilt: number;
  Latitude: number;
  Longitude: number;
}

interface BuildingsResponse {
  buildings: string[];
  totalItem: number;
  totalPages: number;
}

interface BuildingDetailsResponse {
  Building: BuildingsProps;
}

export const handleLogout = (router: NextRouter) => {
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

export default function Overview() {
  const [buildingsList, setBuildingsList] = useState<string[]>([]);
  const [buildingDetails, setBuildingDetails] = useState<BuildingsProps | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [totalItem, setTotalItem] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedDetails, setIsLoadedDetails] = useState<boolean>(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(-1);

  const router = useRouter();

  const logoutHandler = () => {
    handleLogout(router);
  };

  const fetchBuildings = () => {
    setIsLoading(true);
    setTimeout(
      () =>
        fetch(`http://localhost:8081/overview?page=${currentPage}`, {
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch buildings data: ${response.status} ${response.statusText}`
              );
            }
            return response.json() as Promise<BuildingsResponse>;
          })
          .then((data) => {
            setIsLoading(false);
            setBuildingsList(data.buildings);
            // setTotalItem(data.totalItem);
            setTotalPages(data.totalPages);
          })
          .catch((error) => {
            console.error(error);
            window.alert("Failed to fetch buildings data");
          }),
      2000
    );
  };

  const fetchBuildingDetails = (name: string) => {
    setIsLoadingDetails(true);
    setTimeout(
      () =>
        fetch(`http://localhost:8081/details?name=${name}`, {
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch building details: ${response.status} ${response.statusText}`
              );
            }
            return response.json() as Promise<BuildingDetailsResponse>;
          })
          .then((data) => {
            setIsLoadingDetails(false);
            setBuildingDetails(data.Building);
            setIsLoadedDetails(true);
          })
          .catch((error) => {
            console.error(error);
            window.alert("Failed to fetch building details");
          }),
      2000
    );
  };

  useEffect(() => {
    fetchBuildings();
  }, [currentPage]);

  const handleBuildingClick = (index: number) => {
    setSelectedBuildingIndex(index);
  };

  return (
    <div className="flex flex-col items-center py-4 h-screen">
      <div className="flex flex-row w-full items-center justify-center">
        <h1 className="text-3xl font-bold my-4">
          SEATTLE BUILDING DATA VISUALIZATION
        </h1>
        <div className="flex w-[20%] space-x-3 mx-4">
          <button
            className={
              "w-24 border boder-w-1 border-black bg-blue-300 box-border"
            }
          >
            overview
          </button>
          <button
            className={"w-24 border boder-w-1 border-black box-border"}
            onClick={() => {
              router.push("/chart");
            }}
          >
            charts
          </button>
        </div>
      </div>

      <div className="flex flex-row w-full px-8 h-full">
        <div className="flex items-center justify-center w-[50%] h-[100%] ">
          {isLoadingDetails && <Loading />}

          {!isLoadingDetails && buildingDetails != null && (
            <div className="w-[80%] flex flex-col border border-black p-2">
              <div className="flex flex-col justify-center ml-2">
                <p className="text-xl font-bold">
                  {buildingDetails.PropertyName}
                </p>
                <p className=" whitespace-pre-line mb-2">
                  {buildingDetails.PrimaryPropertyType} {"\n"}
                  {buildingDetails.Address} {"\n"} {buildingDetails.City}
                  {"\n"}# of floor: {buildingDetails.NumberofFloors}
                  {"\n"}District: {buildingDetails.CouncilDistrictCode}
                  {"\n"}Built in {buildingDetails.YearBuilt}{" "}
                  {buildingDetails.Latitude}
                </p>{" "}
              </div>
              <div className="flex flex-row justify-center">
                <Map
                  lat={buildingDetails.Latitude}
                  lng={buildingDetails.Longitude}
                  containerStyle={{
                    width: "80%",
                    height: "200px",
                  }}
                />{" "}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 w-[50%] h-[100%]">
          <p>Select one to view details</p>
          <div className="h-[80%] w-full ">
            {isLoading && <Loading />}
            {!isLoading && (
              <ul className="space-y-2 flex-col w-[100%]">
                {buildingsList.map((building, index) => (
                  <li
                    onClick={() => {
                      handleBuildingClick(index);
                      console.log(building);
                      fetchBuildingDetails(building);
                    }}
                    key={index}
                    className={`hover:cursor-pointer py-2 px-2 border border-w-[1px] border-black ${
                      selectedBuildingIndex === index ? "bg-blue-300" : ""
                    }`}
                  >
                    {building}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex w-[80%] justify-between">
            <button
              className=""
              onClick={() => {
                setSelectedBuildingIndex(-1);
                currentPage > 1 ? setCurrentPage(currentPage - 1) : null;
              }}
            >
              <FaArrowLeft size={36} />
            </button>

            <button
              onClick={() => {
                setSelectedBuildingIndex(-1);
                currentPage < totalPages
                  ? setCurrentPage(currentPage + 1)
                  : null;
              }}
            >
              <FaArrowRight size={36} />
            </button>
          </div>
        </div>
      </div>

      {/* Add logout button */}
      <button
        className="fixed bottom-10 left-10 bg-red-500 border border-black px-4 py-2"
        onClick={logoutHandler}
      >
        SIGN OUT
      </button>
    </div>
  );
}

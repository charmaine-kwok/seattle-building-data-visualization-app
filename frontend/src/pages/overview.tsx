import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import Header from "@/components/Header";
import fetchBuildingDetails from "@/functions/api/fetchBuildingDetails";
import fetchBuildingsList from "@/functions/api/fetchBuildingsList";
import SignOutButton from "@/components/SignOutButton";
import handleLogout from "@/functions/handleLogout";
import Loading from "@/components/Loading";
import Map from "@/components/Map";

export interface BuildingsProps {
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

export interface BuildingDetailsResponse {
  Building: BuildingsProps;
}

export default function Overview() {
  const [buildingsList, setBuildingsList] = useState<string[]>([]);
  const [buildingDetails, setBuildingDetails] = useState<BuildingsProps | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(-1);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const router = useRouter();

  const logoutHandler = () => {
    handleLogout(() => router.push("/login"));
  };

  useEffect(() => {
    fetchBuildingsList(
      currentPage,
      setIsLoadingList,
      setBuildingsList,
      setTotalPages,
      setIsAuth,
      () => router.push("/unauthorized")
    );
  }, [currentPage]);

  const handleBuildingClick = (index: number) => {
    setSelectedBuildingIndex(index);
  };

  return (
    isAuth && (
      <div className="flex flex-col items-center py-4 h-screen">
        <Header
          page="overview"
          onClickChart={() => {
            router.push("/chart");
          }}
        />
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
                    {"\n"}Built in {buildingDetails.YearBuilt}
                  </p>
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
              {isLoadingList && <Loading />}
              {!isLoadingList && (
                <ul className="space-y-2 flex-col w-[100%]">
                  {buildingsList.map((building, index) => (
                    <li
                      onClick={() => {
                        handleBuildingClick(index);
                        fetchBuildingDetails(
                          building,
                          setIsLoadingDetails,
                          setBuildingDetails as React.Dispatch<
                            React.SetStateAction<BuildingsProps>
                          >
                        );
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
        <SignOutButton logoutHandler={logoutHandler} />
      </div>
    )
  );
}

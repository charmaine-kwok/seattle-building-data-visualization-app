import React from "react";

interface BuildingsResponse {
  buildings: string[];
  totalItem: number;
  totalPages: number;
}

const fetchBuildingsList = async (
  currentPage: number,
  setIsLoadingList: React.Dispatch<React.SetStateAction<boolean>>,
  setBuildingsList: React.Dispatch<React.SetStateAction<string[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>,
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
  toUnauthorized: () => void
) => {
  setIsLoadingList(true);

  try {
    const response = await fetch(
      `http://localhost:8081/api/buildings/overview?page=${currentPage}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      toUnauthorized();
      throw new Error(
        `Failed to fetch building details: ${response.status} ${response.statusText}`
      );
    }

    setIsAuth(true);
    const data = (await response.json()) as BuildingsResponse;
    setIsLoadingList(false);
    setBuildingsList(data.buildings);
    setTotalPages(data.totalPages);
  } catch (error) {
    // window.alert("Failed to fetch building details. Please login again.");
    console.log(error);
  }
};

export default fetchBuildingsList;

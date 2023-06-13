import React from "react";

interface BuildingsResponse {
  buildings: string[];
  totalItem: number;
  totalPages: number;
}

const fetchBuildingsList = (
  currentPage: number,
  setIsLoadingList: React.Dispatch<React.SetStateAction<boolean>>,
  setBuildingsList: React.Dispatch<React.SetStateAction<string[]>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
) => {
  setIsLoadingList(true);

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
      setIsLoadingList(false);
      setBuildingsList(data.buildings);
      setTotalPages(data.totalPages);
    })
    .catch((error) => {
      window.alert("Failed to fetch buildings data. Please login again.");
    });
};

export default fetchBuildingsList;

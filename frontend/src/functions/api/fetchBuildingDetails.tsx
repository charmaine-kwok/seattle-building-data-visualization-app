import React from "react";
import { BuildingDetailsResponse, BuildingsProps } from "@/pages/overview";

const fetchBuildingDetails = (
  name: string,
  setIsLoadingDetails: React.Dispatch<React.SetStateAction<boolean>>,
  setBuildingDetails: React.Dispatch<React.SetStateAction<BuildingsProps>>
) => {
  setIsLoadingDetails(true);

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
    })
    .catch((error) => {
      console.error(error);
      window.alert("Failed to fetch building details. Please login again.");
    });
};

export default fetchBuildingDetails;

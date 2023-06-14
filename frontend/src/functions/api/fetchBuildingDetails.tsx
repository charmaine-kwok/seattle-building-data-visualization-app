import React from "react";
import { BuildingDetailsResponse, BuildingsProps } from "@/pages/overview";

const fetchBuildingDetails = async (
  name: string,
  setIsLoadingDetails: React.Dispatch<React.SetStateAction<boolean>>,
  setBuildingDetails: React.Dispatch<React.SetStateAction<BuildingsProps>>
) => {
  setIsLoadingDetails(true);

  try {
    const response = await fetch(
      `http://localhost:8081/api/buildings/details?name=${name}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch building details: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as BuildingDetailsResponse;
    setIsLoadingDetails(false);
    setBuildingDetails(data.Building);
  } catch (error) {
    console.error(error);
    window.alert("Failed to fetch building details. Please login again.");
  }
};

export default fetchBuildingDetails;

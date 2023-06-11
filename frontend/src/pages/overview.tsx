import { useEffect, useState } from "react";
import jwtAtom from "@/atoms/jwtAtom";
import { useAtomValue } from "jotai";

interface BuildingsProps {
  City: string;
  PropertyName: string;
}

interface BuildingsResponse {
  buildings: BuildingsProps[];
}

export default function Overview() {
  const jwtAtomValue = useAtomValue(jwtAtom);
  const [buildingsList, setBuildingsList] = useState<BuildingsProps[]>([]);
  console.log(jwtAtomValue);
  const fetchBuildings = () => {
    fetch("http://localhost:8081/overview", {
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
        console.log(data.buildings);
        setBuildingsList(data.buildings);
      })
      .catch((error) => {
        console.error(error);
        window.alert("Failed to fetch buildings data");
      });
  };

  useEffect(() => fetchBuildings(), []);

  return (
    <div className="h-screen flex bg-gray-bg1">
      <h1>Overview</h1>
      <ul>
        {buildingsList.map((building, index) => (
          <li key={index}>
            {building.City} - {building.PropertyName}
          </li>
        ))}
      </ul>
    </div>
  );
}

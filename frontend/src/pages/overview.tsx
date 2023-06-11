import { useEffect, useState } from "react";
import jwtAtom from "@/atoms/jwtAtom";
import { useAtomValue } from "jotai";

interface BuildingsProps {
  City: string;
  PropertyName: string;
}

interface BuildingsResponse {
  buildings: BuildingsProps[];
  totalItem: number;
}
export default function Overview() {
  const jwtAtomValue = useAtomValue(jwtAtom);
  const [buildingsList, setBuildingsList] = useState<BuildingsProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalItem, setTotalItem] = useState<number>(0);

  const fetchBuildings = () => {
    fetch(`http://localhost:8081/overview?page=${page}`, {
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
        setTotalItem(data.totalItem);
        setBuildingsList([...buildingsList, ...data.buildings]);
      })
      .catch((error) => {
        console.error(error);
        window.alert("Failed to fetch buildings data");
      });
  };

  useEffect(() => fetchBuildings(), [page]);

  const handleMoreButtonClick = () => {
    setPage(page + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <h1 className="text-3xl font-bold my-4">Overview</h1>
      <div className="flex flex-col items-center justify-center space-y-4 w-[60%]">
        <ul className="space-y-2 flex-col w-[100%]">
          {buildingsList.map((building, index) => (
            <li
              key={index}
              className="py-2 px-2 border border-w-[1px] border-black"
            >
              {building.City} - {building.PropertyName}
            </li>
          ))}
        </ul>
        {buildingsList.length < totalItem && (
          <button
            className="py-4 px-4 border border-w-[1px] border-green-400 bg-green-400 rounded-md"
            onClick={handleMoreButtonClick}
          >
            More
          </button>
        )}
      </div>
    </div>
  );
}

import { IAverageData } from "@/pages/chart";

const fetchAverageData = async (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setAverageData: React.Dispatch<React.SetStateAction<IAverageData>>
) => {
  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:8081/average", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    const data: IAverageData = await response.json();

    setIsLoading(false);
    setAverageData(data);
  } catch (error) {
    window.alert("Failed to fetch buildings data. Please login again.");
  }
};

export default fetchAverageData;

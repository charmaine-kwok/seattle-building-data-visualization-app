import { IAverageData } from "@/pages/chart";

const fetchAverageData = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setAverageData: React.Dispatch<React.SetStateAction<IAverageData>>
) => {
  setIsLoading(true);

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
    .then((data: IAverageData) => {
      setIsLoading(false);
      setAverageData(data);
    })
    .catch((error) => {
      window.alert("Failed to fetch buildings data. Please login again.");
    });
};

export default fetchAverageData;

import { IAverageData } from '@/pages/chart';

const fetchAverageData = async (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setAverageData: React.Dispatch<React.SetStateAction<IAverageData>>,
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>,
  toUnauthorized: () => void
) => {
  setIsLoading(true);

  try {
    const response = await fetch(
      'http://localhost:8081/api/buildings/average',
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      toUnauthorized();
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }
    setIsAuth(true);
    const data: IAverageData = await response.json();

    setIsLoading(false);
    setAverageData(data);
  } catch (error) {
    // window.alert('Failed to fetch buildings data. Please login again.');
    console.log(error);
  }
};

export default fetchAverageData;

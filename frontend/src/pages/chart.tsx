import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Header from '@/components/Header';
import SignOutButton from '@/components/SignOutButton';
import Loading from '@/components/Loading';
import BarChart from '@/components/BarChart';
import handleLogout from '@/functions/handleLogout';
import fetchAverageData from '@/functions/api/fetchAverageData';

export interface IAverageData {
  [key: string]: number;
}

export default function Chart() {
  const router = useRouter();

  const logoutHandler = () => {
    handleLogout(() => router.push('/login'));
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [averageData, setAverageData] = useState<IAverageData>(
    {} as IAverageData
  );
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    fetchAverageData(setIsLoading, setAverageData, setIsAuth, () =>
      router.push('/unauthorized')
    );
  }, []);

  return (
    isAuth && (
      <div className="flex flex-col items-center py-4 h-screen">
        <Header
          page="charts"
          onClickOverview={() => {
            router.push('/overview');
          }}
        />
        <div className="h-[80%] w-[80%] flex items-center justify-center">
          {isLoading && <Loading />}
          {!isLoading && <BarChart data={averageData} />}
        </div>
        <SignOutButton logoutHandler={logoutHandler} />
      </div>
    )
  );
}

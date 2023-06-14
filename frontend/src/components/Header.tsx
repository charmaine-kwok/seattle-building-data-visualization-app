type HeaderProps = {
  page: string;
  onClickOverview?: () => void;
  onClickChart?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  page,
  onClickOverview,
  onClickChart,
}) => {
  return (
    <div className="flex flex-row w-full items-center justify-center">
      <h1 className="text-3xl font-bold my-4">
        SEATTLE BUILDING DATA VISUALIZATION
      </h1>
      <div className="flex w-[20%] space-x-3 mx-4">
        <button
          className={`w-24 border boder-w-1 border-black ${
            page === "overview" ? "bg-blue-300" : "bg-white"
          }  box-border`}
          onClick={onClickOverview}
        >
          overview
        </button>
        <button
          className={`w-24 border boder-w-1 border-black ${
            page === "charts" ? "bg-blue-300" : "bg-white"
          }  box-border`}
          onClick={onClickChart}
        >
          charts
        </button>
      </div>
    </div>
  );
};

export default Header;

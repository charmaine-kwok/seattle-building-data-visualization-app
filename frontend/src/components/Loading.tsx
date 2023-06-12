import { RotatingLines } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center ">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </div>
  );
}

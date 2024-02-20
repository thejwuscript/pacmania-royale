import { RotatingLines } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <RotatingLines visible={true} strokeColor="grey" strokeWidth="5" animationDuration="0.75" ariaLabel="rotating-lines-loading" />
    </div>
  )
}
import { useState, useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";

export default function Loader() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTimeout(() => setMessage("Please wait..."), 4000);
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <RotatingLines
        visible={true}
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}

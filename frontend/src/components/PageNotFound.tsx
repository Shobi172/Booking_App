import React from "react";
import { Link } from "react-router-dom";
import svg from "../assets/404.svg";

const PageNotFound: React.FC = () => {
  const jwtToken = localStorage.getItem("jwtToken");
  const destination = jwtToken ? "/calendar" : "/";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-96 md:w-128">
        <img src={svg} alt="404 Not Found" className="w-full h-auto" />
      </div>

      <Link to={destination}>
        <button className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default PageNotFound;

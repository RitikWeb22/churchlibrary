import React from "react";
import { Blocked404 } from "@404pagez/react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex dark:bg-gray-800 dark:text-white  justify-center items-center flex-col gap-10 h-screen">
      <img src="errors.png" className="w-[30%]" alt="" />
      <button className="btn btn-warning px-10">
        <Link to={"/"}>Home</Link>
      </button>
    </div>
  );
};

export default ErrorPage;

import React from "react";
import Image from "next/image";
import Link from "next/link";

const ReadyToCustomize = () => {
  return (
    <div className="container flex flex-col gap-2 lg:flex-row items-center p-8 lg:p-16 ">
      {/* Left Section with Images */}
      <div className="lg:w-1/2 flex flex-col space-y-4">
        <div className="relative w-full lg:h-[600px]">
          <Image
            src="/images/ready-customize.png"
            alt="Workspace Top"
            width={500}
            height={300}
            objectFit="cover"
            className="lg:ml-32"
            
          />
        </div>
      </div>

      {/* Right Section with Text */}
      <div className="lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0 lg:h-[600px] px-5">
        <h2 className="text-3xl mt-20 lg:text-5xl font-bold font-heading leading-tight">
        Ready to <p> <span className="text-yellow-500">Customize</span>{" "}
        Your Office?</p>
        </h2>
        <div className="w-96">
        <p className="mt-10 text-gray-700 text-sm lg:text-lg font-sans p-5">
        With Online WorkSpace you are powering productive workforces, connecting and collaborating with your team, achieving more together. It is the best platform for online meetings.
        </p>
        <div className="mt-14 text-gray-700 text-sm lg:text-lg font-sans">
        <Link
            href="/"
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Contact us
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyToCustomize;

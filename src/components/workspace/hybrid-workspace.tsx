import React from "react";
import Image from "next/image";

const HybridWorkspace = () => {
  return (
    <div className="container flex flex-col gap-2 lg:flex-row items-center p-8 lg:p-16 mt-5">
      {/* Left Section with Images */}
      <div className="lg:w-1/2 flex flex-col space-y-4">
        <div className="relative w-full lg:h-[600px]">
          <Image
            src="/images/hybrid-image.png"
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
        <h2 className="text-3xl lg:text-5xl font-bold font-heading leading-tight">
          Unlock a World of <p> <span className="text-yellow-500">HYBRID</span>{" "}
          WorkSpace.</p>
        </h2>
        <div className="w-96">
        <p className="mt-10 text-gray-700 text-sm lg:text-lg font-sans p-5">
          Hybrid working is a better way to work that gives businesses and
          workers more choice on how and where they work. It’s a healthier,
          greener, flexible, and more cost-effective way to do business.
        </p>
        <p className="mt-4 text-gray-700 text-sm lg:text-lg font-sans p-5">
          Hybrid working is greener, more flexible and more productive. And it
          keeps your people happier and more focused. We should say It’s a
          no-brainer.
        </p>
        </div>
      </div>
    </div>
  );
};

export default HybridWorkspace;

import React from "react";
import Image from "next/image";

const GuildedSetup = () => {
  return (
    <div className="container flex flex-col gap-2 lg:flex-row items-center p-8 lg:p-16 mt-5">
      {/* Left Section with Images */}
      <div className="lg:w-1/2 flex flex-col space-y-4">
        <div className="relative w-full lg:h-[600px]">
          <Image
            src="/images/guided-setup.png"
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
        <h2 className="text-3xl lg:text-5xl font-bold font-heading leading-tight mt-24">
          Easy, Guided{" "}
          <p>
            {" "}
            <span className="text-yellow-500">Setup</span> WorkSpace.
          </p>
        </h2>
        <div className="w-96">
          <p className="mt-10 text-gray-700 text-sm lg:text-lg font-sans">
            Our experts work with you from start to finish. Share your vision,
            and we’ll handle the design, setup, and everything in between to
            make it a reality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuildedSetup;

import React from "react";
import Image from "next/image";
import Link from "next/link";

const PerfectMembership = () => {
  return (
    <div className="container flex flex-col gap-2 lg:flex-row items-center p-8 lg:p-16">
      {/* Right Section with Text */}
      <div
        className="lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0 lg:h-[600px] px-5"
      >

       <div className="lg:ml-32">
        <h2 className="text-3xl lg:text-5xl font-bold font-heading leading-tight">
        Find Your Perfect {" "}
          <p>
            {" "}
            <span className="text-yellow-500">Membership</span> Plan <br/> Today
          </p>
        </h2>
        <div className="w-96">
          <p className="mt-10 text-gray-700 text-sm lg:text-lg font-sans p-5">
          Explore our range of memberships to discover the ideal match for your work style. Flexible terms and multiple locations give you the freedom to work your way.
          </p>
          <div className="mt-24 text-gray-700 text-sm lg:text-lg font-sans">
          <Link
            href="/membership"
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Become a Member
          </Link>
          </div>
        </div>
        </div>   
      </div>

      {/* Left Section with Images */}
      <div className="lg:w-1/2 flex flex-col space-y-4">
        <div className="relative w-full lg:h-[600px]">
          <Image
            src="/images/perfect-membership.png"
            alt="Workspace Top"
            width={500}
            height={300}
            objectFit="cover"
            className="mr-32"
          />
        </div>
      </div>
    </div>
  );
};

export default PerfectMembership;

"use client"

import Image from "next/image";
import { FaEllipsisV } from "react-icons/fa";
import { useState } from "react";

export default function ProviderClient() {
  const data = [
    {
      profilePhoto: "/images/user.png",
      name: "Evans D",
      company: "ExpertHub",
      subscription: "Co-working +",
      status: "Used",
    },
    {
      profilePhoto: "/images/user.png",
      name: "Tukay Baba",
      company: "TechCabal",
      subscription: "Private space",
      status: "Running",
    },
    {
      profilePhoto: "/images/user.png",
      name: "Priscila Pretty",
      company: "Techcreek",
      subscription: "Day Office",
      status: "Used",
    },
    {
      profilePhoto: "/images/user.png",
      name: "John Doe",
      company: "SHELL",
      subscription: "Private Office +",
      status: "Running",
    },
  ];

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl mb-5">Client Component</h1>
      <div className="flex flex-col gap-3">
        {data.map((client, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex items-center gap-5">
              <Image
                src={client.profilePhoto}
                alt="profile-Photo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{client.name}</h2>
                <p className="text-sm text-gray-600">{client.company}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Subscription</p>
                <p className="text-base">{client.subscription}</p>
              </div>
              <p
                className={`text-sm font-bold ${
                  client.status === "Used"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {client.status}
              </p>
              <div className="relative">
                <FaEllipsisV
                  size={16}
                  className="cursor-pointer text-gray-600"
                  onClick={() => toggleDropdown(index)}
                />
                {openDropdown === index && (
                  <div className="absolute top-6 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <p className="px-4 py-2 text-sm cursor-pointer border-b border-gray-200 hover:bg-gray-100">
                      Send Message
                    </p>
                    <p className="px-4 py-2 text-sm cursor-pointer border-b border-gray-200 hover:bg-gray-100">
                      Rate Client
                    </p>
                    <p className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100">
                      View Account
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
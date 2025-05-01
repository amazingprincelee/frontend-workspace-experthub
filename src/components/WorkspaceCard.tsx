import React from "react";
import Image from "next/image";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Workspace {
  _id: string;
  title: string;
  providerName: string;
  about: string;
  thumbnail: { url: string };
  registeredClients: { _id: string; profilePicture: string }[];
  startDate: string;
  approved: boolean;
}

export const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-full flex flex-col">
    <div className="relative aspect-video">
      <Image
        src={workspace.thumbnail?.url || "/placeholder-workspace.jpg"}
        alt={workspace.title}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-3 sm:p-4 flex-grow">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-base sm:text-lg font-heading font-semibold text-primary">
          {workspace.title}
        </h3>
        {workspace.approved ? (
          <FaCheckCircle className="text-green-500" title="Approved" />
        ) : (
          <FaTimesCircle className="text-red-500" title="Pending Approval" />
        )}
      </div>
      <p className="text-xs sm:text-sm mb-1">
        Provider: {workspace.providerName}
      </p>
      <p className="text-xs sm:text-sm mb-3">
        {workspace.about?.substring(0, 50)}...
      </p>
      <div className="flex items-center space-x-2 mb-3">
        <div className="flex -space-x-2">
          {workspace.registeredClients.slice(0, 3).map((client) => (
            <div
              key={client._id}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white overflow-hidden"
            >
              <Image
                src={client.profilePicture || "/placeholder-user.jpg"}
                alt="Client"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <p className="text-xs sm:text-sm">
          Clients: {workspace.registeredClients.length}
        </p>
      </div>
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
          <div
            className="bg-green-500 h-full rounded-full"
            style={{ width: "75%" }}
          ></div>
        </div>
        <p className="text-xs sm:text-sm text-gray ml-2">75%</p>
      </div>
    </div>
  </div>
);
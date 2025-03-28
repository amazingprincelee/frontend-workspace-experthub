// components/WorkspaceList.jsx
import React, { useEffect } from "react";
import { useWorkspaces } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const WorkspaceList = () => {
  const { workspaces, fetchWorkspaces, loading } = useWorkspaces();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      fetchWorkspaces(user.id);
    }
  }, [user]);

  if (loading) {
    return <div className="p-4 text-center">Loading workspaces...</div>;
  }

  if (!Object.keys(workspaces).length) {
    return <div className="p-4 text-center">No workspaces available.</div>;
  }

  return (
    <div className="p-4">
      {Object.entries(workspaces).map(([category, workspaceList]) => (
        <div key={category} className="mb-8">
          {/* Category Header */}
          <h2 className="text-xl font-bold mb-4">{category}</h2>
          {/* Workspace Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workspaceList.map((workspace) => (
              <div
                key={workspace._id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                {/* Workspace Image */}
                <img
                  src={workspace.image || "https://via.placeholder.com/300x150"}
                  alt={workspace.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                {/* Workspace Details */}
                <div className="mt-2">
                  <h3 className="text-lg font-semibold">{workspace.name}</h3>
                  <p className="text-sm text-gray-600">{workspace.description}</p>
                  {/* Progress Bar */}
                  <div className="mt-2">
                    <span className="text-sm">Overall progress</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${workspace.progress || 70}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{workspace.progress || 70}%</span>
                  </div>
                  {/* Registered Clients */}
                  <div className="mt-2 flex items-center">
                    <span className="text-sm">Checked in 24h</span>
                    <div className="ml-2 flex">
                      {workspace.registeredClients?.slice(0, 3).map((client) => (
                        <img
                          key={client._id}
                          src={client.profilePicture || "https://via.placeholder.com/30"}
                          alt={client.fullname}
                          className="w-6 h-6 rounded-full border-2 border-white -ml-2"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* View All Button */}
          <div className="text-right mt-4">
            <Link href={`/workspaces/${category}`}>
              <button className="text-orange-500 font-semibold">VIEW ALL</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkspaceList;
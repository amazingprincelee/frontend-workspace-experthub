// src/app/admin/workspaces/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/utils/apiService";
import { message, Button } from "antd";
import Loader from "@/components/FetchLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

const AdminWorkspaces = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.get(`/workspace/all?adminId=${user.id}`);
        setWorkspaces(response.data.workspaces || {});
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        message.error("Failed to fetch workspaces");
        setWorkspaces({});
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWorkspaces();
    }
  }, [user]);

  const handleViewClick = (workspaceId) => {
    router.push(`/admin/workspace/${workspaceId}`);
  };

  if (authLoading || isLoading) {
    return <Loader />;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Workspaces</h1>
        </div>

        {!workspaces || Object.keys(workspaces).length === 0 ? (
          <div className="text-center">No workspaces found</div>
        ) : (
          Object.keys(workspaces).map((category) => (
            <div key={category} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{category}</h2>
                <Link href={`/admin/workspaces/category/${encodeURIComponent(category)}`}>
                  <Button type="link" className="text-primary">
                    VIEW ALL
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {workspaces[category].map((workspace) => (
                  <div
                    key={workspace._id}
                    className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-primary"
                    onClick={() => handleViewClick(workspace._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleViewClick(workspace._id);
                      }
                    }}
                  >
                    {/* Workspace Image */}
                    <img
                      src={workspace.thumbnail?.url || "https://via.placeholder.com/300x150"}
                      alt={workspace.title}
                      className="w-full h-40 object-cover rounded mb-4"
                    />
                    {/* Title and Description */}
                    <h3 className="text-lg font-semibold mb-2">{workspace.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {workspace.about?.length > 100
                        ? `${workspace.about.substring(0, 100)}...`
                        : workspace.about}
                    </p>
                    {/* Progress Bar */}
                    <div className="mb-4">
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
                    <div className="flex items-center mb-4">
                      <span className="text-sm mr-2">Checked in 24h</span>
                      <div className="flex">
                        {workspace.registeredClients?.slice(0, 4).map((client, index) => (
                          <img
                            key={client._id}
                            src={client.profilePicture || "/default-avatar.png"}
                            alt={client.fullname}
                            className="w-6 h-6 rounded-full border-2 border-white -ml-2 first:ml-0"
                          />
                        ))}
                        {workspace.registeredClients?.length > 4 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold -ml-2">
                            +{workspace.registeredClients.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminWorkspaces;
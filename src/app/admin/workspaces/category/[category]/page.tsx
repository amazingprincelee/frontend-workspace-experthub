// src/app/admin/workspaces/category/[category]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/utils/apiService";
import { message, Button, Tag } from "antd";
import Loader from "@/components/FetchLoader";
import ProtectedRoute from "@/components/ProtectedRoute";

const AdminCategoryWorkspaces = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { category } = useParams();
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.post(
          "/workspace/category",
          { category, userId: user._id }
        );
        setWorkspaces(response.data.workspaces);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        message.error("Failed to fetch workspaces");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && category) {
      fetchWorkspaces();
    }
  }, [user, category]);

  // Update this function to navigate to /admin/workspace/:workspaceId
  const handleViewClick = (workspaceId) => {
    router.push(`/admin/workspace/${workspaceId}`);
  };

  if (authLoading || isLoading) {
    return <Loader />;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{category} Workspaces</h1>
        {workspaces.length === 0 ? (
          <div className="text-center">No workspaces found in this category</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace._id}
                className="border rounded-lg shadow-lg p-4 bg-white"
              >
                <img
                  src={workspace.thumbnail.url}
                  alt={workspace.title}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{workspace.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {workspace.about.length > 100
                    ? `${workspace.about.substring(0, 100)}...`
                    : workspace.about}
                </p>
                <Tag color={workspace.approved ? "green" : "red"} className="mb-4">
                  {workspace.approved ? "Approved" : "Unapproved"}
                </Tag>
                <div className="flex mb-4">
                  {workspace.registeredClients.slice(0, 4).map((client, index) => (
                    <img
                      key={client._id}
                      src={client.profilePicture || "/default-avatar.png"}
                      alt={client.fullname}
                      className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0"
                    />
                  ))}
                  {workspace.registeredClients.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold -ml-2">
                      +{workspace.registeredClients.length - 4}
                    </div>
                  )}
                </div>
                <Button
                  type="primary"
                  onClick={() => handleViewClick(workspace._id)}
                  className="w-full"
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminCategoryWorkspaces;
// src/app/admin/workspace/[workspaceId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/utils/apiService";
import { message, Tag } from "antd";
import Loader from "@/components/FetchLoader";
import ProtectedRoute from "@/components/ProtectedRoute";

const AdminWorkspaceDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWorkspace = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.get(
          `/workspace/${workspaceId}?userId=${user.id}`
        );
        setWorkspace(response.data.workspace);
      } catch (error) {
        console.error("Error fetching workspace:", error);
        message.error("Failed to fetch workspace details");
        router.push("/admin/workspaces");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && workspaceId) {
      fetchWorkspace();
    }
  }, [user, workspaceId, router]);

  if (authLoading || isLoading || !workspace) {
    return <Loader />;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{workspace.title}</h1>
        <Tag color={workspace.approved ? "green" : "red"} className="mb-4">
          {workspace.approved ? "Approved" : "Unapproved"}
        </Tag>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={workspace.thumbnail.url}
              alt={workspace.title}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <p className="text-sm text-gray-600">
              <strong>Provider:</strong> {workspace.providerName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Category:</strong> {workspace.category || "Uncategorized"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {workspace.location || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Capacity:</strong> {workspace.persons} persons
            </p>
            <p className="text-sm text-gray-600">
              <strong>Duration:</strong> {workspace.duration} hours
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fee:</strong> ${workspace.fee || 0}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Privacy:</strong> {workspace.privacy}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700 mb-4">{workspace.about}</p>
            <h2 className="text-xl font-semibold mb-2">Schedule</h2>
            <p className="text-gray-700">
              <strong>Start Date:</strong> {workspace.startDate || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>End Date:</strong> {workspace.endDate || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Start Time:</strong> {workspace.startTime || "N/A"}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>End Time:</strong> {workspace.endTime || "N/A"}
            </p>
            <h2 className="text-xl font-semibold mb-2">Registered Clients</h2>
            {workspace.registeredClients.length === 0 ? (
              <p className="text-gray-700">No clients registered yet.</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {workspace.registeredClients.map((client) => (
                  <div key={client._id} className="flex items-center">
                    <img
                      src={client.profilePicture || "/default-avatar.png"}
                      alt={client.fullname}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <span>{client.fullname}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminWorkspaceDetails;
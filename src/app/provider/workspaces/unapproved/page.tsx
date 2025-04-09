"use client";

import React, { useState, useEffect } from "react";
import apiService from "@/utils/apiService";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { WorkspaceCard } from "@/components/WorkspaceCard";


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

const UnapprovedWorkspaces: React.FC = () => {
  const [unapprovedWorkspaces, setUnapprovedWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const fetchProviderWorkspaces = async () => {
    try {
      const response = await apiService.get(`/workspace/creator/${user.id}`);
      if (!response.data.unapprovedWorkspaces) {
        setUnapprovedWorkspaces([]);
        return;
      }

      const unapproved: Workspace[] = response.data.unapprovedWorkspaces.map((workspace: any) => ({
        _id: workspace._id,
        title: workspace.title || "Untitled Workspace",
        providerName: workspace.providerName || "Unknown Provider",
        about: workspace.about || "No description available",
        thumbnail: workspace.thumbnail || { url: "/placeholder-workspace.jpg" },
        registeredClients: workspace.registeredClients || [],
        startDate: workspace.startDate || new Date().toISOString(),
        approved: workspace.approved !== undefined ? workspace.approved : false,
      }));

      setUnapprovedWorkspaces(unapproved);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || authLoading) return;
    fetchProviderWorkspaces();
  }, [user, authLoading]);

  if (loading) {
    return <div className="text-center p-6 text-gray">Loading...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={["provider"]}>
      <div className="container mx-auto px-4 sm:px-6 py-6 bg-background min-h-screen">
        <h2 className="text-lg sm:text-xl font-heading font-bold text-primary mb-4">
          All Pending Approval Workspaces
        </h2>
        {unapprovedWorkspaces.length === 0 ? (
          <p className="text-gray text-center py-4">No workspaces pending approval</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unapprovedWorkspaces.map((workspace) => (
              <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default UnapprovedWorkspaces;
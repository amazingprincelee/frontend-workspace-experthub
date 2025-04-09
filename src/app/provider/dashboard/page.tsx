"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/utils/apiService";
import { notification } from "antd";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FaUsers, FaBuilding, FaChartLine, FaUserTie } from "react-icons/fa";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { StatCard } from "@/components/StatCard";
import { SectionContainer } from "@/components/SectionContainer";

interface DashboardStats {
  totalWorkspaces: number;
  totalClients: number;
  totalSubscriptions: number;
  totalProviders: number;
}

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

const ProviderDashboard: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [approvedWorkspaces, setApprovedWorkspaces] = useState<Workspace[]>([]);
  const [unapprovedWorkspaces, setUnapprovedWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const fetchDashboardStats = async () => {
    try {
      const response = await apiService.get("/workspace/provider-stats", {
        params: { providerId: user.id },
      });
      setStats(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const fetchProviderWorkspaces = async () => {
    try {
      const response = await apiService.get(`/workspace/creator/${user.id}`);
      console.log('Raw API response:', response.data);

      // Check if the response has the expected structure
      if (!response.data.approvedWorkspaces || !response.data.unapprovedWorkspaces) {
        console.log('Invalid response structure');
        setApprovedWorkspaces([]);
        setUnapprovedWorkspaces([]);
        return;
      }

      // Map approved workspaces
      const approved: Workspace[] = response.data.approvedWorkspaces.map((workspace: any) => ({
        _id: workspace._id,
        title: workspace.title || "Untitled Workspace",
        providerName: workspace.providerName || "Unknown Provider",
        about: workspace.about || "No description available",
        thumbnail: workspace.thumbnail || { url: "/placeholder-workspace.jpg" },
        registeredClients: workspace.registeredClients || [],
        startDate: workspace.startDate || new Date().toISOString(),
        approved: workspace.approved !== undefined ? workspace.approved : true, // Should always be true
      }));

      // Map unapproved workspaces
      const unapproved: Workspace[] = response.data.unapprovedWorkspaces.map((workspace: any) => ({
        _id: workspace._id,
        title: workspace.title || "Untitled Workspace",
        providerName: workspace.providerName || "Unknown Provider",
        about: workspace.about || "No description available",
        thumbnail: workspace.thumbnail || { url: "/placeholder-workspace.jpg" },
        registeredClients: workspace.registeredClients || [],
        startDate: workspace.startDate || new Date().toISOString(),
        approved: workspace.approved !== undefined ? workspace.approved : false, // Should always be false
      }));

      console.log('Processed approved workspaces:', approved);
      console.log('Processed unapproved workspaces:', unapproved);

      setApprovedWorkspaces(approved);
      setUnapprovedWorkspaces(unapproved);

      if (unapproved.length === 0 && approved.length > 0) {
        console.log('No unapproved workspaces found, but approved workspaces exist');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    if (!user || authLoading) return;
    console.log('Current user:', { id: user.id, role: user.role });
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchProviderWorkspaces(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [user, authLoading]);

  useEffect(() => {
    if (error) {
      api.error({
        message: "Error",
        description: error,
      });
      setError(null);
    }
  }, [error, api]);

  if (loading) {
    return <div className="text-center p-6 text-gray">Loading...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={["provider"]}>
      <div className="container mx-auto px-4 sm:px-6 py-6 bg-background min-h-screen ">
        {contextHolder}

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={<FaBuilding className="text-blue-500 text-xl sm:text-2xl" />}
            title="Total Workspaces"
            value={stats?.totalWorkspaces || 0}
            bgColor="bg-blue-100"
          />
          <StatCard 
            icon={<FaUsers className="text-yellow-500 text-xl sm:text-2xl" />}
            title="Total Clients"
            value={stats?.totalClients || 0}
            bgColor="bg-yellow-100"
          />
          <StatCard 
            icon={<FaChartLine className="text-green-500 text-xl sm:text-2xl" />}
            title="Running Subscriptions"
            value={stats?.totalSubscriptions || 0}
            bgColor="bg-green-100"
          />
          <StatCard 
            icon={<FaUserTie className="text-purple-500 text-xl sm:text-2xl" />}
            title="Workspaces Assigned To You"
            value={stats?.totalProviders || 0}
            bgColor="bg-purple-100"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => router.push("/provider/createspace")}
            className="bg-primary text-white font-heading font-semibold py-2 px-6 rounded-lg hover:bg-secondary transition text-sm sm:text-base"
          >
            + Create Workspace
          </button>
         
          <button
            onClick={fetchProviderWorkspaces}
            className="bg-gray-500 text-white font-heading font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
          >
            Refresh
          </button>
        </div>

        <SectionContainer 
          title="Approved Workspaces" 
          viewAllLink="/provider/workspaces/approved"
          isEmpty={approvedWorkspaces.length === 0}
          emptyMessage="No approved workspaces found"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {approvedWorkspaces.slice(0, 4).map((workspace) => (
              <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
          </div>
        </SectionContainer>

        <SectionContainer 
          title="Pending Approval Workspaces" 
          viewAllLink="/provider/workspaces/unapproved"
          isEmpty={unapprovedWorkspaces.length === 0}
          emptyMessage="No workspaces pending approval"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {unapprovedWorkspaces.slice(0, 4).map((workspace) => (
              <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
          </div>
        </SectionContainer>
      </div>
    </ProtectedRoute>
  );
};

export default ProviderDashboard;
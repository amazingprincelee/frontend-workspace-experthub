"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/utils/apiService";
import { notification } from "antd";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FaUsers, FaBuilding, FaChartLine, FaUserTie, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Image from "next/image";

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
      <div className="container mx-auto px-4 sm:px-6 py-6 bg-background min-h-screen">
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
            title="Total Subscriptions"
            value={stats?.totalSubscriptions || 0}
            bgColor="bg-green-100"
          />
          <StatCard 
            icon={<FaUserTie className="text-purple-500 text-xl sm:text-2xl" />}
            title="Assigned Workspaces"
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

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => (
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
      <p className="text-xs sm:text-sm text-gray mb-1">
        Provider: {workspace.providerName}
      </p>
      <p className="text-xs sm:text-sm text-gray mb-3">
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
        <p className="text-xs sm:text-sm text-gray">
          Clients: {workspace.registeredClients.length}
        </p>
      </div>
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
          <div
            className="bg-green-500 h-full rounded-full"
            style={{ width: "75%" }} // This could be dynamic based on some metric
          ></div>
        </div>
        <p className="text-xs sm:text-sm text-gray ml-2">75%</p>
      </div>
    </div>
  </div>
);

const StatCard = ({ icon, title, value, bgColor }: { icon: React.ReactNode, title: string, value: number, bgColor: string }) => (
  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border flex items-center space-x-3">
    <div className={`p-2 sm:p-3 ${bgColor} rounded-full`}>
      {icon}
    </div>
    <div>
      <h3 className="text-xs sm:text-sm font-heading text-gray">{title}</h3>
      <p className="text-lg sm:text-xl md:text-2xl font-bold font-heading text-primary">{value}</p>
    </div>
  </div>
);

const SectionContainer = ({ 
  title, 
  viewAllLink, 
  children, 
  isEmpty, 
  emptyMessage 
}: { 
  title: string, 
  viewAllLink: string, 
  children: React.ReactNode, 
  isEmpty: boolean, 
  emptyMessage: string 
}) => {
  const router = useRouter();
  
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-heading font-bold text-primary">{title}</h2>
        <button
          onClick={() => router.push(viewAllLink)}
          className="text-primary font-heading font-semibold hover:underline text-sm sm:text-base"
        >
          View All
        </button>
      </div>
      {isEmpty ? (
        <p className="text-gray text-center py-4">{emptyMessage}</p>
      ) : (
        children
      )}
    </div>
  );
};

export default ProviderDashboard;
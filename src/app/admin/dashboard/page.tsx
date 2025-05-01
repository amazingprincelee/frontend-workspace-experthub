"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/utils/apiService";
import { notification } from "antd";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FaUsers, FaBuilding, FaChartLine, FaUserTie } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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
}

const AdminDashboard: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);
  const [recommendedWorkspaces, setRecommendedWorkspaces] = useState<Workspace[]>([]);
  const [unapprovedWorkspaces, setUnapprovedWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null); // State to hold error messages
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await apiService.get("/workspace/dashboard-stats", {
        params: { adminId: user.id },
      });
      setStats(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    }
  };

  // Fetch all workspaces (for "All Workspaces" section)
  const fetchAllWorkspaces = async () => {
    try {
      const response = await apiService.get(`/workspace/all?adminId=${user.id}`);
      const groupedWorkspaces = response.data.workspaces;
      const workspacesList: Workspace[] = Object.values(groupedWorkspaces)
        .flat()
        .map((workspace: any) => ({
          _id: workspace._id,
          title: workspace.title,
          providerName: workspace.providerName,
          about: workspace.about,
          thumbnail: workspace.thumbnail,
          registeredClients: workspace.registeredClients || [],
          startDate: workspace.startDate,
        }));
      setAllWorkspaces(workspacesList.slice(0, 3));
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    }
  };

  // Fetch recommended workspaces (random workspaces)
  const fetchRecommendedWorkspaces = async () => {
    try {
      const response = await apiService.get(`/workspace/recommended`);
      console.log("Recommended Workspace Response:", response);

      // Since the backend returns a single workspace, we wrap it in an array for consistency with the UI
      const workspace = response.data.workspace;
      const workspaceData: Workspace = {
        _id: workspace._id,
        title: workspace.title,
        providerName: workspace.providerName,
        about: workspace.about,
        thumbnail: workspace.thumbnail,
        registeredClients: workspace.registeredClients || [],
        startDate: workspace.startDate,
      };
      setRecommendedWorkspaces([workspaceData]); // Set as an array with one item
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    }
  };

  const fetchUnaprovedWorkspaces = async () => {
    try {
      const response = await apiService.get(`/workspace/creator/${user.id}`);
      console.log('Raw API response:', response.data);

      // Check if the response has the expected structure
      if (!response.data.approvedWorkspaces || !response.data.unapprovedWorkspaces) {
        console.log('Invalid response structure');
        setUnapprovedWorkspaces([]);
        return;
      }

      // Map approved workspaces
      // const approved: Workspace[] = response.data.approvedWorkspaces.map((workspace: any) => ({
      //   _id: workspace._id,
      //   title: workspace.title || "Untitled Workspace",
      //   providerName: workspace.providerName || "Unknown Provider",
      //   about: workspace.about || "No description available",
      //   thumbnail: workspace.thumbnail || { url: "/placeholder-workspace.jpg" },
      //   registeredClients: workspace.registeredClients || [],
      //   startDate: workspace.startDate || new Date().toISOString(),
      //   approved: workspace.approved !== undefined ? workspace.approved : true, // Should always be true
      // }));

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

      console.log('Processed unapproved workspaces:', unapproved);

      setUnapprovedWorkspaces(unapproved);

      if (unapproved.length === 0) {
        console.log('No unapproved workspaces found, but approved workspaces exist');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
      console.error('Fetch error:', error);
    }
  };

  // Load data when user is available
  useEffect(() => {
    if (!user || authLoading) return;
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchAllWorkspaces(),
        fetchRecommendedWorkspaces(),
        fetchUnaprovedWorkspaces()
      ]);
      setLoading(false);
    };
    loadData();
  }, [user, authLoading]);

  // Display error notifications
  useEffect(() => {
    if (error) {
      api.error({
        message: "Error",
        description: error,
      });
      setError(null); // Clear the error after displaying
    }
  }, [error, api]);

  // Handle carousel navigation for "All Workspaces"
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allWorkspaces.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allWorkspaces.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return <div className="text-center p-6 text-gray">Loading...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto px-4 sm:px-6 py-6 bg-background min-h-screen">
        {contextHolder}

        {/* Statistics Section */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<FaBuilding className="text-blue-500 text-xl sm:text-2xl" />}
            title="Total No of Workspaces"
            value={stats?.totalWorkspaces || 0}
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={<FaUsers className="text-yellow-500 text-xl sm:text-2xl" />}
            title="Total No of Clients"
            value={stats?.totalClients || 0}
            bgColor="bg-yellow-100"
          />
          <StatCard
            icon={<FaChartLine className="text-green-500 text-xl sm:text-2xl" />}
            title="Total No of Subscription"
            value={stats?.totalSubscriptions || 0}
            bgColor="bg-green-100"
          />
          <StatCard
            icon={<FaUserTie className="text-purple-500 text-xl sm:text-2xl" />}
            title="Workspace Providers"
            value={stats?.totalProviders || 0}
            bgColor="bg-purple-100"
          />
        </div>

        {/* Create Workspace Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => router.push("/admin/createspace")}
            className="bg-primary text-white font-heading font-semibold py-2 px-6 rounded-lg hover:bg-secondary transition text-sm sm:text-base"
          >
            + Create Workspace
          </button>
        </div>

        {/* All Workspaces Section */}
        <SectionContainer
          title="All Workspaces"
          viewAllLink="/admin/workspaces"
          isEmpty={allWorkspaces.length === 0}
          emptyMessage="No workspaces found"
        >
          <div className="relative">
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2">
              {allWorkspaces.map((workspace, index) => (
                <div
                  key={workspace._id}
                  className={`flex-shrink-0 w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 transition-transform duration-300 ${index === currentIndex ? "block" : "hidden sm:block"
                    }`}
                >
                  <WorkspaceCard workspace={workspace} />
                </div>
              ))}
            </div>
            {allWorkspaces.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 -left-2 sm:-left-4 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-secondary hidden sm:block"
                >
                  <IoIosArrowBack />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 -right-2 sm:-right-4 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-secondary hidden sm:block"
                >
                  <IoIosArrowForward />
                </button>
              </>
            )}
          </div>
        </SectionContainer>

        {/* Recommended Workspaces Section */}
        {/* <SectionContainer
          title="Recommended for You"
          viewAllLink="/admin/workspaces"
          isEmpty={recommendedWorkspaces.length === 0}
          emptyMessage="No recommended workspaces found"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedWorkspaces.map((workspace) => (
              <RecommendedWorkspaceCard
                key={workspace._id}
                workspace={workspace}
                onClick={() => router.push(`/workspace/${workspace._id}`)}
              />
            ))}
          </div>
        </SectionContainer> */}
        
        <SectionContainer
          title="Pending Approval Workspaces"
          viewAllLink="/admin/workspace/unapproved"
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

// Reusable Stat Card Component
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

// Reusable Section Container Component
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

// Reusable Workspace Card Component
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
      <h3 className="text-base sm:text-lg font-heading font-semibold text-primary mb-1">
        {workspace.title}
      </h3>
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
            style={{ width: "75%" }}
          ></div>
        </div>
        <p className="text-xs sm:text-sm text-gray ml-2">75%</p>
      </div>
    </div>
  </div>
);

// Reusable Recommended Workspace Card Component
const RecommendedWorkspaceCard = ({ workspace, onClick }: { workspace: Workspace, onClick: () => void }) => (
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
      <p className="text-xs sm:text-sm text-gray mb-1">
        Provider: {workspace.providerName}
      </p>
      <h3 className="text-base sm:text-lg font-heading font-semibold text-primary mb-2">
        {workspace.title?.substring(0, 30)}...
      </h3>
      <p className="text-xs sm:text-sm text-gray mb-4">
        {new Date(workspace.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>

    </div>
  </div>
);

export default AdminDashboard;
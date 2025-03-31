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
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      api.error({
        message: "Failed to fetch dashboard stats",
        description: error.response?.data?.message || error.message,
      });
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
      setAllWorkspaces(workspacesList.slice(0, 3)); // Limit to 3 for display
    } catch (error: any) {
      api.error({
        message: "Failed to fetch all workspaces",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Fetch recommended workspaces (random workspaces)
  const fetchRecommendedWorkspaces = async () => {
    try {
      const response = await apiService.get(`/workspace/recommended-workspaces/${user.id}`);
      const workspacesList: Workspace[] = response.data.workspaces
        .map((workspace: any) => ({
          _id: workspace._id,
          title: workspace.title,
          providerName: workspace.providerName,
          about: workspace.about,
          thumbnail: workspace.thumbnail,
          registeredClients: workspace.registeredClients || [],
          startDate: workspace.startDate,
        }))
        .sort(() => Math.random() - 0.5); // Shuffle for randomness
      setRecommendedWorkspaces(workspacesList.slice(0, 4)); // Limit to 4 for display
    } catch (error: any) {
      api.error({
        message: "Failed to fetch recommended workspaces",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  useEffect(() => {
    if (!user || authLoading) return;
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchAllWorkspaces(),
        fetchRecommendedWorkspaces(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [user, authLoading]);

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
      <div className="container mx-auto p-6 bg-background min-h-screen">
        {contextHolder}
        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaBuilding className="text-blue-500 text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-heading text-gray">Total No of Workspaces</h3>
              <p className="text-2xl font-bold font-heading text-primary">{stats?.totalWorkspaces || 0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaUsers className="text-yellow-500 text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-heading text-gray">Total No of Clients</h3>
              <p className="text-2xl font-bold font-heading text-primary">{stats?.totalClients || 0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <FaChartLine className="text-green-500 text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-heading text-gray">Total No of Subscription</h3>
              <p className="text-2xl font-bold font-heading text-primary">{stats?.totalSubscriptions || 0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaUserTie className="text-purple-500 text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-heading text-gray">Workspace Providers</h3>
              <p className="text-2xl font-bold font-heading text-primary">{stats?.totalProviders || 0}</p>
            </div>
          </div>
        </div>

        {/* Create Workspace Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => router.push("/admin/createspace")}
            className="bg-primary text-white font-heading font-semibold py-2 px-4 rounded-lg hover:bg-secondary transition"
          >
            + Create Workspace
          </button>
        </div>

        {/* All Workspaces Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-heading font-bold text-primary">All Workspaces</h2>
            <button
              onClick={() => router.push("/admin/workspaces")}
              className="text-primary font-heading font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          {allWorkspaces.length === 0 ? (
            <p className="text-gray text-center">No workspaces found</p>
          ) : (
            <div className="relative">
              <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {allWorkspaces.map((workspace, index) => (
                  <div
                    key={workspace._id}
                    className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-2 transition-transform duration-300 ${
                      index === currentIndex ? "block" : "hidden sm:block"
                    }`}
                  >
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={workspace.thumbnail?.url || "/placeholder-workspace.jpg"}
                          alt={workspace.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-heading font-semibold text-primary">
                          {workspace.title}
                        </h3>
                        <p className="text-sm text-gray">
                          Provider: {workspace.providerName}
                        </p>
                        <p className="text-sm text-gray mb-2">
                          {workspace.about?.substring(0, 50)}...
                        </p>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex -space-x-2">
                            {workspace.registeredClients.slice(0, 3).map((client) => (
                              <div
                                key={client._id}
                                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
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
                          <p className="text-sm text-gray">
                            Students: {workspace.registeredClients.length}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray ml-2">75%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-secondary"
              >
                <IoIosArrowBack />
              </button>
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-secondary"
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
        </div>

        {/* Recommended Workspaces Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-heading font-bold text-primary">Recommended for You</h2>
            <button
              onClick={() => router.push("/admin/workspaces")}
              className="text-primary font-heading font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          {recommendedWorkspaces.length === 0 ? (
            <p className="text-gray text-center">No recommended workspaces found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedWorkspaces.map((workspace) => (
                <div
                  key={workspace._id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <div className="relative h-32">
                    <Image
                      src={workspace.thumbnail?.url || "/placeholder-workspace.jpg"}
                      alt={workspace.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray">
                      Provider: {workspace.providerName}
                    </p>
                    <h3 className="text-lg font-heading font-semibold text-primary">
                      {workspace.title?.substring(0, 30)}...
                    </h3>
                    <p className="text-sm text-gray mb-2">
                      {new Date(workspace.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <button
                      onClick={() => router.push(`/workspace/${workspace._id}`)}
                      className="bg-primary text-white font-heading font-semibold py-2 px-4 rounded-lg hover:bg-secondary transition w-full"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
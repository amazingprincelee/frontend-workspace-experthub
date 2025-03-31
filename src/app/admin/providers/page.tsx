// app/admin/providers/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import apiService from "@/utils/apiService";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import { Menu, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Provider {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  role: string;
  profilePicture: string;
  workspacesCreated: number;
  isVerified: boolean;
  blocked: boolean;
}

const ProvidersPage: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || authLoading) return;
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/workspace/workspaces-by-provider", {
          params: { adminId: user.id },
        });

        const providersData = response.data.data.providers || [];
        console.log("Fetched providers with workspace counts:", providersData);

        setProviders(providersData);
      } catch (error: any) {
        api.error({
          message: "Failed to fetch providers",
          description: error.response?.data?.message || error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [api, user, authLoading]);

  // Handle deleting a provider
  const handleDelete = async (providerId: string) => {
    try {
      await apiService.delete(`/user/${providerId}`, {
        data: { adminId: user.id }, // Pass adminId in the request body
      });

      // Update the local state by removing the deleted provider
      setProviders((prevProviders) =>
        prevProviders.filter((provider) => provider.id !== providerId)
      );

      api.success({
        message: "Success",
        description: "Provider deleted successfully",
      });
    } catch (error: any) {
      api.error({
        message: "Failed to delete provider",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Handle blocking/unblocking a provider
  const handleBlock = async (providerId: string) => {
    try {
      // Find the provider to determine the new blocked status (toggle between true/false)
      const provider = providers.find((p) => p.id === providerId);
      if (!provider) {
        throw new Error("Provider not found in local state");
      }
      const newBlockedStatus = !provider.blocked;
  
      await apiService.put(`/user/block-user/${providerId}`, {
        adminId: user.id,
        blocked: newBlockedStatus,
      });
  
      // Update the local state to reflect the new blocked status
      setProviders((prevProviders) =>
        prevProviders.map((p) =>
          p.id === providerId ? { ...p, blocked: newBlockedStatus } : p
        )
      );
  
      api.success({
        message: "Success",
        description: `Provider ${newBlockedStatus ? "blocked" : "unblocked"} successfully`,
      });
    } catch (error: any) {
      api.error({
        message: `Failed to ${providers.find((p) => p.id === providerId)?.blocked ? "unblock" : "block"} provider`,
        description: error.response?.data?.message || error.message,
      });
    }
  };
  

  const handleMenuClick = (action: string, providerId: string) => {
    switch (action) {
      case "view":
        router.push(`/admin/provider/${providerId}`);
        break;
      case "delete":
        handleDelete(providerId);
        break;
      case "block":
        handleBlock(providerId);
        break;
      default:
        break;
    }
  };

  const menu = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId);
    return (
      <Menu onClick={({ key }) => handleMenuClick(key, providerId)}>
        <Menu.Item key="view">View Account</Menu.Item>
        <Menu.Item key="delete">Delete User</Menu.Item>
        <Menu.Item key="block">{provider?.blocked ? "Unblock" : "Block"} Tutor</Menu.Item>
      </Menu>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto p-6">
        {contextHolder}
        <h1 className="text-2xl font-bold mb-4">Providers</h1>
        {loading ? (
          <div className="text-center">Loading providers...</div>
        ) : providers.length === 0 ? (
          <div className="text-center">No providers found</div>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
              >
                {/* Left: Profile Picture, Full Name, Company */}
                <div className="flex items-center space-x-4 w-1/3">
                  {provider.profilePicture ? (
                    <img
                      src={provider.profilePicture}
                      alt={provider.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{provider.fullName}</h3>
                    <p className="text-sm text-gray-500">{provider.companyName}</p>
                  </div>
                </div>

                {/* Middle: Details Column */}
                <div className="w-1/3 text-sm text-gray-600">
                  <p className="font-bold">Details</p>
                  <p>Email: {provider.email}</p>
                  <p>Workspaces: {provider.workspacesCreated} created</p>
                  <p>Verified: {provider.isVerified ? "Verified" : "Not Verified"}</p>
                </div>

                {/* Right: Phone Number */}
                <div className="w-1/3 text-sm text-green-600 font-bold text-right mr-28">
                  <p>{provider.phone}</p>
                </div>

                {/* Actions Dropdown */}
                <Dropdown overlay={menu(provider.id)} trigger={["click"]}>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreOutlined className="text-xl" />
                  </button>
                </Dropdown>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProvidersPage;



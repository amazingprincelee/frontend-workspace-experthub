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

interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  profilePicture: string;
  isVerified: boolean;
  blocked: boolean;
  workspacesEnrolled: number;
}

const ClientsPage: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || authLoading) return;
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/workspace/workspaces-by-client", {
          params: { adminId: user.id },
        });

        const clientsData = response.data.data.clients || [];
        console.log("Fetched clients with workspace counts:", clientsData);

        setClients(clientsData);
      } catch (error: any) {
        api.error({
          message: "Failed to fetch clients",
          description: error.response?.data?.message || error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [api, user, authLoading]);

  // Handle deleting a client
  const handleDelete = async (clientId: string) => {
    try {
      await apiService.delete(`/user/${clientId}`, {
        data: { adminId: user.id }, // Pass adminId in the request body
      });

      // Update the local state by removing the deleted client
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== clientId)
      );

      api.success({
        message: "Success",
        description: "Client deleted successfully",
      });
    } catch (error: any) {
      api.error({
        message: "Failed to delete client",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Handle blocking/unblocking a client
  const handleBlock = async (clientId: string) => {
    try {
      // Find the client to determine the new blocked status (toggle between true/false)
      const client = clients.find((c) => c.id === clientId);
      if (!client) {
        throw new Error("Client not found in local state");
      }
      const newBlockedStatus = !client.blocked;

      await apiService.put(`/user/block-user/${clientId}`, {
        adminId: user.id,
        blocked: newBlockedStatus,
      });

      // Update the local state to reflect the new blocked status
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === clientId ? { ...c, blocked: newBlockedStatus } : c
        )
      );

      api.success({
        message: "Success",
        description: `Client ${newBlockedStatus ? "blocked" : "unblocked"} successfully`,
      });
    } catch (error: any) {
      api.error({
        message: `Failed to ${clients.find((c) => c.id === clientId)?.blocked ? "unblock" : "block"} client`,
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const handleMenuClick = (action: string, clientId: string) => {
    switch (action) {
      case "view":
        router.push(`/admin/client/${clientId}`);
        break;
      case "delete":
        handleDelete(clientId);
        break;
      case "block":
        handleBlock(clientId);
        break;
      default:
        break;
    }
  };

  const menu = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return (
      <Menu onClick={({ key }) => handleMenuClick(key, clientId)}>
        <Menu.Item key="view">View Account</Menu.Item>
        <Menu.Item key="delete">Delete User</Menu.Item>
        <Menu.Item key="block">{client?.blocked ? "Unblock" : "Block"} Client</Menu.Item>
      </Menu>
    );
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto p-6 bg-background min-h-screen">
        {contextHolder}
        <h1 className="text-2xl font-heading font-bold mb-4 text-primary">Clients</h1>
        {loading ? (
          <div className="text-center text-gray">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="text-center text-gray">No clients found</div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 border border-gray rounded-lg shadow-sm bg-white"
              >
                {/* Left: Profile Picture, Full Name, Status */}
                <div className="flex items-center space-x-4 w-1/3">
                  {client.profilePicture ? (
                    <img
                      src={client.profilePicture}
                      alt={client.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-12 h-12 text-gray" />
                  )}
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-primary">{client.fullName}</h3>
                    <p className={`text-sm ${client.workspacesEnrolled > 0 ? "text-primary" : "text-danger"}`}>
                      {client.workspacesEnrolled > 0 ? "Enrolled to a workspace" : "Not Enrolled to a workspace"}
                    </p>
                  </div>
                </div>

                {/* Middle: Details Column */}
                <div className="w-1/3 text-sm text-gray">
                  <p className="font-bold font-heading">Details</p>
                  <p>Email: {client.email}</p>
                  <p>Workspaces: {client.workspacesEnrolled} Enrolled</p>
                  <p>Verified: {client.isVerified ? "Verified" : "Not Verified"}</p>
                </div>

                {/* Right: Phone Number */}
                <div className="w-1/3 text-sm text-primary font-bold font-heading text-right mr-28">
                  <p>{client.phone}</p>
                </div>

                {/* Actions Dropdown */}
                <Dropdown overlay={menu(client.id)} trigger={["click"]}>
                  <button className="text-gray hover:text-primary">
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

export default ClientsPage;
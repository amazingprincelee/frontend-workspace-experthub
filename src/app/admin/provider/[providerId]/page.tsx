"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notification, Modal, Input, Select, Button, Rate } from "antd";
import apiService from "@/utils/apiService";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FaUserCircle } from "react-icons/fa";
import dayjs from "dayjs";

interface Provider {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  country: string;
  state: string;
  companyName: string;
  profilePicture: string;
  isVerified: boolean;
}

interface Workspace {
  _id: string;
  title: string;
  registeredClients: string[];
  startDate: string;
}

interface Transaction {
  _id: string;
  amount: number;
  type: string;
  createdAt: string;
}

interface Feedback {
  _id: string;
  userId: { fullname: string; profilePicture: string };
  rating: number;
  comment: string;
  createdAt: string;
}

const ProviderDetails = ({ params }: { params: { providerId: string } }) => {
  const [api, contextHolder] = notification.useNotification();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [isCreditModalVisible, setIsCreditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Provider>>({});
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [creditAmount, setCreditAmount] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();

  // Fetch provider details
  const fetchProviderDetails = async () => {
    try {
      const response = await apiService.get(`/user/profile/${params.providerId}`);
      setProvider(response.data.user);
      setEditFormData(response.data.user); // Pre-fill edit form
    } catch (error: any) {
      api.error({
        message: "Failed to fetch provider details",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Fetch provider workspaces
  const fetchWorkspaces = async () => {
    try {
      const response = await apiService.get(`/workspace/creator/${params.providerId}`);
      setWorkspaces(response.data.workspaces.slice(0, 2)); // Limit to 2 for display
    } catch (error: any) {
      api.error({
        message: "Failed to fetch workspaces",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Fetch wallet balance and transactions
  const fetchWalletData = async () => {
    try {
      const response = await apiService.get(`/transaction/balance/${params.providerId}`);
      setBalance(response.data.balance);
      setTransactions(response.data.transactions.slice(0, 3)); // Limit to 3 for display
    } catch (error: any) {
      api.error({
        message: "Failed to fetch wallet data",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Fetch feedback
  const fetchFeedback = async () => {
    try {
      const response = await apiService.get(`/feedback/provider/${params.providerId}`);
      setFeedback(response.data.feedback);
    } catch (error: any) {
      api.error({
        message: "Failed to fetch feedback",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Fetch all workspaces for assignment
  const fetchAllWorkspaces = async () => {
    try {
      const response = await apiService.get(`/workspace/all?adminId=${user.id}`);
      const groupedWorkspaces = response.data.workspaces;
      const workspacesList: Workspace[] = Object.values(groupedWorkspaces)
      .flat()
      .map((workspace: any) => ({
        _id: workspace._id,
        title: workspace.title,
        registeredClients: workspace.registeredClients || [],
        startDate: workspace.startDate,
      }));
    
      setAllWorkspaces(workspacesList);
    } catch (error: any) {
      api.error({
        message: "Failed to fetch workspaces for assignment",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProviderDetails(),
        fetchWorkspaces(),
        fetchWalletData(),
        fetchFeedback(),
        fetchAllWorkspaces(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [user]);

  // Handle Verify/Unverify User
  const handleVerify = async (verify: boolean) => {
    try {
      const endpoint = verify ? `/user/verify/${params.providerId}` : `/user/unverify/${params.providerId}`;
      await apiService.put(endpoint, { adminId: user.id });
      setProvider((prev) => prev ? { ...prev, isVerified: verify } : prev);
      api.success({
        message: "Success",
        description: `Provider ${verify ? "verified" : "unverified"} successfully`,
      });
    } catch (error: any) {
      api.error({
        message: `Failed to ${verify ? "verify" : "unverify"} provider`,
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Handle Edit Provider Details
  const handleEditSubmit = async () => {
    try {
      await apiService.put(`/user/updateProfile/${params.providerId}`, editFormData);
      setProvider((prev) => prev ? { ...prev, ...editFormData } : prev);
      setIsEditModalVisible(false);
      api.success({
        message: "Success",
        description: "Provider details updated successfully",
      });
    } catch (error: any) {
      api.error({
        message: "Failed to update provider details",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Handle Assign to Workspace
  const handleAssignSubmit = async () => {
    if (!selectedWorkspace) {
      api.error({ message: "Please select a workspace" });
      return;
    }
    try {
      await apiService.post(`/workspace/assign/${selectedWorkspace}`, { id: params.providerId });
      setIsAssignModalVisible(false);
      api.success({
        message: "Success",
        description: "Provider assigned to workspace successfully",
      });
    } catch (error: any) {
      api.error({
        message: "Failed to assign provider to workspace",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Handle Credit Wallet
  const handleCreditSubmit = async () => {
    const amount = parseFloat(creditAmount);
    if (!amount || amount <= 0) {
      api.error({ message: "Please enter a valid amount" });
      return;
    }
    try {
      await apiService.post("/transaction/add-funds", { userId: params.providerId, amount });
      setBalance((prev) => prev + amount);
      setIsCreditModalVisible(false);
      api.success({
        message: "Success",
        description: "Wallet credited successfully",
      });
    } catch (error: any) {
      api.error({
        message: "Failed to credit wallet",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto p-6">
        {contextHolder}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section: Personal Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Personal Details</h2>
            <div className="flex items-center space-x-4 mb-4">
              {provider?.profilePicture ? (
                <img
                  src={provider.profilePicture}
                  alt={provider.fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-16 h-16 text-gray-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold">{provider?.fullName}</h3>
                <p className="text-sm text-gray-500">{provider?.email}</p>
              </div>
            </div>
            <div className="flex space-x-2 mb-4">
              <Button
                
                 className="bg-plateformgreen text-white"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                onClick={() => handleVerify(true)}
                disabled={provider?.isVerified}
              >
                Verify this user
              </Button>
              <Button
               
                className="bg-secondary"
                style={{ backgroundColor: "#faad14", borderColor: "#faad14" }}
                onClick={() => handleVerify(false)}
                disabled={!provider?.isVerified}
              >
                Unverify this user
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {provider?.isVerified ? "This user is verified" : "This user is not verified"}
            </p>
            <div className="space-y-2">
              <p><strong>Phone Number:</strong> {provider?.phone}</p>
              <p><strong>Gender:</strong> {provider?.gender}</p>
              <p><strong>Age:</strong> {provider?.age}</p>
              <p><strong>Country of Residence:</strong> {provider?.country}</p>
              <p><strong>State of Residence:</strong> {provider?.state}</p>
              <p><strong>Company Name:</strong> {provider?.companyName}</p>
            </div>
            <Button
              type="primary"
              style={{ backgroundColor: "#faad14", borderColor: "#faad14", marginTop: "16px" }}
              onClick={() => setIsEditModalVisible(true)}
            >
              Edit
            </Button>
          </div>

          {/* Right Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Provider Workspaces */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Provider Workspaces</h2>
                <Button
                  type="link"
                  onClick={() => router.push(`/admin/provider/${params.providerId}/workspaces`)}
                >
                  View All
                </Button>
              </div>
              {workspaces.length === 0 ? (
                <p>No workspaces found</p>
              ) : (
                workspaces.map((workspace) => (
                  <div key={workspace._id} className="flex justify-between items-center mb-4 border border-orange-500 p-4">
                    <div>
                      <h3 className="font-semibold">{workspace.title}</h3>
                      <p className="text-sm text-gray-500">
                        Registered clients: {workspace.registeredClients.length}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {dayjs(workspace.startDate).format("MMM D, YYYY")}
                      </p>
                    </div>
                    <Button
                      type="primary"
                      style={{ backgroundColor: "#faad14", borderColor: "#faad14" }}
                      onClick={() => router.push(`/workspace/${workspace._id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Wallet & Transaction */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Wallet Balance: {balance.toLocaleString()}</h2>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white">A</span>
                  </div>
                  <div>
                    <p className="font-semibold">Transaction</p>
                    <p className="text-sm text-gray-500">Oct 29 2025</p>
                  </div>
                </div>
                <Button
                  
                  className="bg-plateformgreen"
                  onClick={() => setIsCreditModalVisible(true)}
                >
                  + Credit Wallet
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Transaction History</h3>
                <Button
                  type="link"
                  onClick={() => router.push(`/admin/provider/${params.providerId}/transactions`)}
                >
                  View All
                </Button>
              </div>
              {transactions.length === 0 ? (
                <p>Transaction history details here</p>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction._id} className="mt-2">
                    <p>
                      {transaction.type === "credit" ? "Credit" : "Debit"}: {transaction.amount} -{" "}
                      {dayjs(transaction.createdAt).format("MMM D, YYYY")}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Assign to Workspace */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Assign this user to a workspace</h2>
              <Button
                type="primary"
                className="bg-primary"
                onClick={() => setIsAssignModalVisible(true)}
              >
                + Assign to workspace
              </Button>
            </div>

            {/* Feedback & Rating */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Feedback & Rating</h2>
              {feedback.length === 0 ? (
                <p>No feedback available</p>
              ) : (
                feedback.map((item) => (
                  <div key={item._id} className="mb-4">
                    <div className="flex items-center space-x-2">
                      {item.userId.profilePicture ? (
                        <img
                          src={item.userId.profilePicture}
                          alt={item.userId.fullname}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <p className="font-semibold">{item.userId.fullname}</p>
                        <Rate disabled value={item.rating} />
                        <p className="text-sm text-gray-500">{item.comment}</p>
                        <p className="text-sm text-gray-500">
                          {dayjs(item.createdAt).format("MMM D, YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal
          title="Edit Provider Details"
          open={isEditModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => setIsEditModalVisible(false)}
        >
          <div className="space-y-4">
            <div>
              <label>Full Name</label>
              <Input
                value={editFormData.fullName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, fullName: e.target.value })
                }
              />
            </div>
            <div>
              <label>Email</label>
              <Input
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label>Phone</label>
              <Input
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label>Gender</label>
              <Input
                value={editFormData.gender}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, gender: e.target.value })
                }
              />
            </div>
            <div>
              <label>Age</label>
              <Input
                value={editFormData.age}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, age: e.target.value })
                }
              />
            </div>
            <div>
              <label>Country</label>
              <Input
                value={editFormData.country}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, country: e.target.value })
                }
              />
            </div>
            <div>
              <label>State</label>
              <Input
                value={editFormData.state}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, state: e.target.value })
                }
              />
            </div>
            <div>
              <label>Company Name</label>
              <Input
                value={editFormData.companyName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, companyName: e.target.value })
                }
              />
            </div>
          </div>
        </Modal>

        {/* Assign to Workspace Modal */}
        <Modal
          title="Assign to Workspace"
          open={isAssignModalVisible}
          onOk={handleAssignSubmit}
          onCancel={() => setIsAssignModalVisible(false)}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select a workspace"
            onChange={(value) => setSelectedWorkspace(value)}
            value={selectedWorkspace}
          >
            {allWorkspaces.map((workspace) => (
              <Select.Option key={workspace._id} value={workspace._id}>
                {workspace.title}
              </Select.Option>
            ))}
          </Select>
        </Modal>

        {/* Credit Wallet Modal */}
        <Modal
          title="Credit Wallet"
          open={isCreditModalVisible}
          onOk={handleCreditSubmit}
          onCancel={() => setIsCreditModalVisible(false)}
        >
          <Input
            type="number"
            placeholder="Enter amount"
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
          />
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default ProviderDetails;
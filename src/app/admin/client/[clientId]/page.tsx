"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notification, Modal, Input, Select, Button, Rate } from "antd";
import apiService from "@/utils/apiService";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FaUserCircle } from "react-icons/fa";
import dayjs from "dayjs";

interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  country: string;
  state: string;
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

const ClientDetails = ({ params }: { params: { clientId: string } }) => {
  const [api, contextHolder] = notification.useNotification();
  const [client, setClient] = useState<Client | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [isCreditModalVisible, setIsCreditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Client>>({});
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [creditAmount, setCreditAmount] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();

  // Fetch client details
  const fetchClientDetails = async () => {
    try {
      const response = await apiService.get(`/user/profile/${params.clientId}`);
      setClient(response.data.user);
      setEditFormData(response.data.user);
    } catch (error: any) {
      api.error({
        message: "Failed to fetch client details",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Fetch client workspaces (enrolled workspaces)
  const fetchWorkspaces = async () => {
    try {
      const response = await apiService.get(`/workspace/enrolled-workspaces/${params.clientId}`);
      setWorkspaces(response.data.enrolledWorkspaces.slice(0, 2)); // Limit to 2 for display
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
      const response = await apiService.get(`/transaction/balance/${params.clientId}`);
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
      const response = await apiService.get(`/feedback/client/${params.clientId}`);
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
        fetchClientDetails(),
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
      const endpoint = verify ? `/user/verify/${params.clientId}` : `/user/unverify/${params.clientId}`;
      await apiService.put(endpoint, { adminId: user.id });
      setClient((prev) => (prev ? { ...prev, isVerified: verify } : prev));
      api.success({
        message: "Success",
        description: `Client ${verify ? "verified" : "unverified"} successfully`,
      });
    } catch (error: any) {
      api.error({
        message: `Failed to ${verify ? "verify" : "unverify"} client`,
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Handle Edit Client Details
  const handleEditSubmit = async () => {
    try {
      await apiService.put(`/user/updateProfile/${params.clientId}`, editFormData);
      setClient((prev) => (prev ? { ...prev, ...editFormData } : prev));
      setIsEditModalVisible(false);
      api.success({
        message: "Success",
        description: "Client details updated successfully",
      });
    } catch (error: any) {
      api.error({
        message: "Failed to update client details",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Handle Enroll Client in a Workspace
  const handleAssignSubmit = async () => {
    if (!selectedWorkspace) {
      api.error({ message: "Please select a workspace" });
      return;
    }
    try {
      await apiService.post(`/workspace/enroll/${selectedWorkspace}`, { id: params.clientId });
      setIsAssignModalVisible(false);
      // Optionally, refetch workspaces to update the list
      await fetchWorkspaces();
      api.success({
        message: "Success",
        description: "Client enrolled in workspace successfully",
      });
    } catch (error: any) {
      api.error({
        message: "Failed to enroll client in workspace",
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
      await apiService.post("/transaction/add-funds", { userId: params.clientId, amount });
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
    return <div className="text-center p-6 text-gray">Loading...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto p-6 bg-background min-h-screen">
        {contextHolder}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section: Personal Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray">
            <h2 className="text-xl font-heading font-bold mb-4 text-primary">Personal Details</h2>
            <div className="flex items-center space-x-4 mb-4">
              {client?.profilePicture ? (
                <img
                  src={client.profilePicture}
                  alt={client.fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-16 h-16 text-gray" />
              )}
              <div>
                <h3 className="text-lg font-heading font-semibold text-primary">{client?.fullName}</h3>
                <p className="text-sm text-gray">{client?.email}</p>
                <p className={`text-sm ${workspaces.length > 0 ? "text-primary" : "text-danger"}`}>
                  {workspaces.length > 0 ? "Enrolled" : "Not Enrolled"}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 mb-4">
              <Button
                className="bg-primary text-white border-primary"
                onClick={() => handleVerify(true)}
                disabled={client?.isVerified}
              >
                Verify this user
              </Button>
              <Button
                className="bg-secondary text-white border-secondary"
                onClick={() => handleVerify(false)}
                disabled={!client?.isVerified}
              >
                Unverify this user
              </Button>
            </div>
            <p className="text-sm text-gray mb-4">
              {client?.isVerified ? "This user is verified" : "This user is not verified"}
            </p>
            <div className="space-y-2 text-gray">
              <p><strong className="font-heading">Phone Number:</strong> {client?.phone}</p>
              <p><strong className="font-heading">Gender:</strong> {client?.gender}</p>
              <p><strong className="font-heading">Age:</strong> {client?.age}</p>
              <p><strong className="font-heading">Country of Residence:</strong> {client?.country}</p>
              <p><strong className="font-heading">State of Residence:</strong> {client?.state}</p>
            </div>
            <Button
              className="bg-secondary text-white border-secondary mt-4"
              onClick={() => setIsEditModalVisible(true)}
            >
              Edit
            </Button>
          </div>

          {/* Right Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Client Workspaces */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-heading font-bold text-primary">Enrolled Workspaces</h2>
                <Button
                  type="link"
                  className="text-primary"
                  onClick={() => router.push(`/admin/client/${params.clientId}/workspaces`)}
                >
                  View All
                </Button>
              </div>
              {workspaces.length === 0 ? (
                <p className="text-gray">No workspaces found</p>
              ) : (
                workspaces.map((workspace) => (
                  <div key={workspace._id} className="flex justify-between items-center mb-4 border border-primary p-4 rounded-lg">
                    <div>
                      <h3 className="font-heading font-semibold text-primary">{workspace.title}</h3>
                      <p className="text-sm text-gray">
                        Registered clients: {workspace.registeredClients.length}
                      </p>
                      <p className="text-sm text-gray">
                        Start Date: {dayjs(workspace.startDate).format("MMM D, YYYY")}
                      </p>
                    </div>
                    <Button
                      className="bg-secondary text-white border-secondary"
                      onClick={() => router.push(`/workspace/${workspace._id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Wallet & Transaction */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray">
              <h2 className="text-xl font-heading font-bold mb-4 text-primary">
                Wallet Balance: {balance.toLocaleString()}
              </h2>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-heading">C</span>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-primary">Transaction</p>
                    <p className="text-sm text-gray">Last Updated: {dayjs().format("MMM D, YYYY")}</p>
                  </div>
                </div>
                <Button
                  className="bg-primary text-white border-primary"
                  onClick={() => setIsCreditModalVisible(true)}
                >
                  + Credit Wallet
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-semibold text-primary">Transaction History</h3>
                <Button
                  type="link"
                  className="text-primary"
                  onClick={() => router.push(`/admin/client/${params.clientId}/transactions`)}
                >
                  View All
                </Button>
              </div>
              {transactions.length === 0 ? (
                <p className="text-gray">No transaction history available</p>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction._id} className="mt-2">
                    <p className="text-gray">
                      {transaction.type === "credit" ? "Credit" : "Debit"}: {transaction.amount} -{" "}
                      {dayjs(transaction.createdAt).format("MMM D, YYYY")}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Assign to Workspace */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray">
              <h2 className="text-xl font-heading font-bold mb-4 text-primary">Enroll this client to a workspace</h2>
              <Button
                className="bg-primary text-white border-primary"
                onClick={() => setIsAssignModalVisible(true)}
              >
                + Enroll to Workspace
              </Button>
            </div>

            {/* Feedback & Rating */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray">
              <h2 className="text-xl font-heading font-bold mb-4 text-primary">Feedback & Rating</h2>
              {feedback.length === 0 ? (
                <p className="text-gray">No feedback available</p>
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
                        <FaUserCircle className="w-8 h-8 text-gray" />
                      )}
                      <div>
                        <p className="font-heading font-semibold text-primary">{item.userId.fullname}</p>
                        <Rate disabled value={item.rating} />
                        <p className="text-sm text-gray">{item.comment}</p>
                        <p className="text-sm text-gray">
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
          title="Edit Client Details"
          open={isEditModalVisible}
          onOk={handleEditSubmit}
          onCancel={() => setIsEditModalVisible(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="font-heading">Full Name</label>
              <Input
                value={editFormData.fullName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, fullName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-heading">Email</label>
              <Input
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-heading">Phone</label>
              <Input
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-heading">Gender</label>
              <Input
                value={editFormData.gender}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, gender: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-heading">Age</label>
              <Input
                value={editFormData.age}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, age: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-heading">Country</label>
              <Input
                value={editFormData.country}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, country: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-heading">State</label>
              <Input
                value={editFormData.state}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, state: e.target.value })
                }
              />
            </div>
          </div>
        </Modal>

        {/* Enroll in Workspace Modal */}
        <Modal
          title="Enroll in Workspace"
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

export default ClientDetails;
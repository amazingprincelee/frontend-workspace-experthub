// src/app/admin/workspace/[workspaceId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/utils/apiService";
import { message, Tag, Button, Modal, Form, Input, InputNumber, Select, DatePicker, TimePicker } from "antd";
import Loader from "@/components/FetchLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { Option } = Select;

const AdminWorkspaceDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchWorkspace = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.get(`/workspace/${workspaceId}?adminId=${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Workspace Data:", response.data.workspace); // Debug the date and time formats
        setWorkspace(response.data.workspace);
      } catch (error) {
        console.error("Error fetching workspace:", error);
        message.error("Failed to fetch workspace details");
        // router.push("/admin/workspaces");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && workspaceId) {
      fetchWorkspace();
    }
  }, [user, workspaceId, router]);

  const handleDelete = async () => {
    Modal.confirm({
      title: "Are you sure you want to delete this workspace?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await apiService.delete(`/workspace/delete/${workspaceId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          message.success("Workspace deleted successfully");
          router.push("/admin/workspaces");
        } catch (error) {
          console.error("Error deleting workspace:", error);
          message.error("Failed to delete workspace");
        }
      },
    });
  };

  const handleApproveDisapprove = async () => {
    const newStatus = !workspace.approved;
    try {
      const endpoint = newStatus ? `/workspace/approve/${workspaceId}` : `/workspace/disapprove/${workspaceId}`;
      await apiService.put(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success(`Workspace ${newStatus ? "approved" : "disapproved"} successfully`);
      setWorkspace({ ...workspace, approved: newStatus });
    } catch (error) {
      console.error(`Error ${newStatus ? "approving" : "disapproving"} workspace:`, error);
      message.error(`Failed to ${newStatus ? "approve" : "disapprove"} workspace`);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      title: workspace.title,
      about: workspace.about,
      duration: workspace.duration,
      type: workspace.type,
      startDate: workspace.startDate ? dayjs(workspace.startDate, "YYYY-MM-DD") : null,
      endDate: workspace.endDate ? dayjs(workspace.endDate, "YYYY-MM-DD") : null,
      startTime: workspace.startTime ? dayjs(workspace.startTime, "HH:mm") : null,
      endTime: workspace.endTime ? dayjs(workspace.endTime, "HH:mm") : null,
      category: workspace.category,
      privacy: workspace.privacy,
      workDuration: workspace.workDuration,
      fee: workspace.fee,
      strikedFee: workspace.strikedFee,
      providerName: workspace.providerName,
      location: workspace.location,
      persons: workspace.persons,
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : undefined,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : undefined,
        startTime: values.startTime ? values.startTime.format("HH:mm:ss") : undefined,
        endTime: values.endTime ? values.endTime.format("HH:mm:ss") : undefined,
      };

      const response = await apiService.put(`workspace/edit/${workspaceId}`, formattedValues, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      message.success("Workspace updated successfully");
      setWorkspace(response.data.workspace);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating workspace:", error);
      message.error("Failed to update workspace");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsedDate = dayjs(date, "YYYY-MM-DD");
    return parsedDate.isValid() ? parsedDate.format("MMMM D, YYYY") : "Invalid Date";
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    // Try parsing in multiple formats
    const parsedTime = dayjs(time, "HH:mm:ss").isValid()
      ? dayjs(time, "HH:mm:ss")
      : dayjs(time, "HH:mm");
    return parsedTime.isValid() ? parsedTime.format("h:mm A") : "Invalid Time";
  };

  // Function to format numbers as currency in Nigerian Naira (₦)
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (authLoading || isLoading || !workspace) {
    return <Loader />;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-4">{workspace.title}</h1>
            <Tag color={workspace.approved ? "green" : "red"} className="mb-4">
              {workspace.approved ? "Approved" : "Unapproved"}
            </Tag>
          </div>
          <div className="space-x-2">
            <Button type="primary" onClick={handleEdit}>
              Edit
            </Button>
            <Button type="primary" danger onClick={handleDelete}>
              Delete
            </Button>
            <Button type="default" onClick={handleApproveDisapprove}>
              {workspace.approved ? "Disapprove" : "Approve"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={workspace.thumbnail?.url || "https://via.placeholder.com/300x150"}
              alt={workspace.title}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <p className="text-sm text-gray-600">
              <strong>Provider:</strong> {workspace.providerName || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Category:</strong> {workspace.category || "Uncategorized"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {workspace.location || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Capacity:</strong> {workspace.persons || "N/A"} persons
            </p>
            <p className="text-sm text-gray-600">
              <strong>Duration:</strong> {workspace.duration || "N/A"} hours
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fee:</strong> {formatCurrency(workspace.fee)}
            </p>
            {workspace.strikedFee && (
              <p className="text-sm text-gray-600">
                <strong>Striked Fee:</strong>{" "}
                <del>{formatCurrency(workspace.strikedFee)}</del>
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>Privacy:</strong> {workspace.privacy || "N/A"}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-700 mb-4">{workspace.about || "No description available."}</p>
            <h2 className="text-xl font-semibold mb-2">Schedule</h2>
            <p className="text-gray-700">
              <strong>Start Date:</strong> {formatDate(workspace.startDate)}
            </p>
            <p className="text-gray-700">
              <strong>End Date:</strong> {formatDate(workspace.endDate)}
            </p>
            <p className="text-gray-700">
              <strong>Start Time:</strong> {formatTime(workspace.startTime)}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>End Time:</strong> {formatTime(workspace.endTime)}
            </p>
            <h2 className="text-xl font-semibold mb-2">Registered Clients</h2>
            {workspace.registeredClients?.length === 0 ? (
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

        {/* Edit Workspace Modal */}
        <Modal
          title="Edit Workspace"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="about"
              label="About"
              rules={[{ required: true, message: "Please enter the description" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration (hours)"
              rules={[{ required: true, message: "Please enter the duration" }]}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item name="type" label="Type">
              <Input />
            </Form.Item>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="endDate" label="End Date">
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="startTime" label="Start Time">
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
            <Form.Item name="endTime" label="End Time">
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Input />
            </Form.Item>
            <Form.Item name="privacy" label="Privacy">
              <Select>
                <Option value="public">Public</Option>
                <Option value="private">Private</Option>
              </Select>
            </Form.Item>
            <Form.Item name="workDuration" label="Work Duration">
              <Input />
            </Form.Item>
            <Form.Item name="fee" label="Fee">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="strikedFee" label="Striked Fee">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="providerName" label="Provider Name">
              <Input />
            </Form.Item>
            <Form.Item name="location" label="Location">
              <Input />
            </Form.Item>
            <Form.Item name="persons" label="Capacity (persons)">
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default AdminWorkspaceDetails;
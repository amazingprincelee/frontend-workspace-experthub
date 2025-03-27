// components/AddCategory.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/utils/apiService";
import { Form, Input, Button, message, Table, Modal, Space } from "antd";
import Loader from "@/components/FetchLoader";

const AddCategory = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // Track loading state for delete/update actions

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get("/workspace/all/category");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Handle form submission for adding a new category
  const onFinish = async (values) => {
    setFormLoading(true);
    try {
      if (!user?.id) {
        throw new Error("User ID is missing");
      }
      const response = await apiService.post(
        `/workspace/category/${user.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      message.success("Category added successfully");
      form.resetFields();
      // Refresh categories
      const updatedCategories = await apiService.get("/workspace/all/category");
      setCategories(updatedCategories.data.categories);
    } catch (error) {
      console.error("Error adding category:", error);
      message.error(error.message || "Failed to add category");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete category
  const handleDelete = async (categoryName) => {
    setActionLoading((prev) => ({ ...prev, [categoryName]: "delete" }));
    try {
      await apiService.delete(`/workspace/delete/${categoryName}/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("Category deleted successfully");
      // Refresh categories
      const updatedCategories = await apiService.get("/workspace/all/category");
      setCategories(updatedCategories.data.categories);
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setActionLoading((prev) => ({ ...prev, [categoryName]: undefined }));
    }
  };

  // Handle update category (show modal)
  const handleUpdate = (category) => {
    setSelectedCategory(category);
    updateForm.setFieldsValue({ name: category.name });
    setIsModalVisible(true);
  };

  // Handle modal form submission for updating a category
  const handleUpdateSubmit = async (values) => {
    setActionLoading((prev) => ({ ...prev, [selectedCategory.name]: "update" }));
    try {
      await apiService.put(
        `/workspace/update/${selectedCategory.name}/${user.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Category updated successfully");
      setIsModalVisible(false);
      // Refresh categories
      const updatedCategories = await apiService.get("/workspace/all/category");
      setCategories(updatedCategories.data.categories);
    } catch (error) {
      console.error("Error updating category:", error);
      message.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setActionLoading((prev) => ({ ...prev, [selectedCategory.name]: undefined }));
    }
  };

  // Table columns for displaying categories
  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleUpdate(record)}
            className="bg-primary hover:bg-gray text-white border-none"
            loading={actionLoading[record.name] === "update"}
            disabled={actionLoading[record.name] === "delete"}
          >
            Update
          </Button>
          <Button
            type="primary"
            onClick={() => handleDelete(record.name)}
            className="bg-danger hover:bg-gray text-white border-none"
            loading={actionLoading[record.name] === "delete"}
            disabled={actionLoading[record.name] === "update"}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading || !user) {
    console.log("Loading or no user:", { loading, user });
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Workspace Category</h1>

      {/* Form to Add Category */}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please enter a category name" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={formLoading}
            className="bg-primary hover:bg-secondary text-white border-none"
          >
            Add Category
          </Button>
        </Form.Item>
      </Form>

      {/* Table to Display Categories */}
      <h2 className="text-xl font-bold mt-8 mb-4">Existing Categories</h2>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="name"
        pagination={false}
        bordered
      />

      {/* Modal for Updating Category */}
      <Modal
        title="Update Category"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={updateForm} layout="vertical" onFinish={handleUpdateSubmit}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter a category name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-primary hover:bg-secondary text-white border-none"
              loading={actionLoading[selectedCategory?.name] === "update"}
            >
              Update Category
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCategory;
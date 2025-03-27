// components/AddCategory.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // i just renamed this on the file
import apiService from "@/utils/apiService";
import { Form, Input, Button, message } from "antd";
import Loader from "@/components/Loader";

const AddCategory = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);

  // Debug user object
  console.log("User object:", user);

  const onFinish = async (values) => {
    setFormLoading(true);
    try {
      if (!user?.id) {
        throw new Error("User ID is missing");
      }
      const response = await apiService.post(`/workspace/category/${user.id}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      message.success("Category added successfully");
      form.resetFields();
      router.push("/admin/addcategory");
    } catch (error) {
      console.error("Error adding category:", error);
      message.error(error.message || "Failed to add category");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading || !user) {
    console.log("Loading or no user:", { loading, user });
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Workspace Category</h1>
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
    </div>
  );
};

export default AddCategory;
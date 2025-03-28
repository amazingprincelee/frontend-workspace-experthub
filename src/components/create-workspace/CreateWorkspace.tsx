// components/CreateWorkspace.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/utils/apiService";
import { Form, Input, Select, Button, Upload, message, AutoComplete } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Loader from "@/components/FetchLoader";

const { Option } = Select;

const CreateWorkspace = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [providerOptions, setProviderOptions] = useState([]);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch categories and providers on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.get("/workspace/all/category");
        const allCategories = response.data.categories.map((cat) => cat.name);
        setCategories(
          allCategories.filter((cat, index) => allCategories.indexOf(cat) === index)
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories");
      }
    };

    const fetchProviders = async () => {
      try {
        const response = await apiService.get("/workspace/approved-providers");
        setProviders(response.data.providers);
        setProviderOptions(
          response.data.providers.map((provider) => ({
            value: provider.fullname,
            label: provider.fullname,
            id: provider._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching providers:", error);
        message.error("Failed to load providers");
      }
    };

    fetchCategories();
    fetchProviders();
  }, []);

  // Handle provider name search/filter (for providers only)
  const onSearchProvider = (searchText) => {
    if (user.role.toLowerCase() === "provider") {
      const filtered = providers
        .filter((provider) =>
          provider.fullname.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((provider) => ({
          value: provider.fullname,
          label: provider.fullname,
          id: provider._id,
        }));
      setProviderOptions(filtered);
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
    setFormLoading(true);
    try {
      const formData = new FormData();
      // Debug the form values
      console.log("Form values:", values);

      // Ensure thumbnail is present
      if (!values.thumbnail || !values.thumbnail[0]?.originFileObj) {
        throw new Error("Thumbnail is required");
      }

      Object.keys(values).forEach((key) => {
        if (key === "thumbnail") {
          formData.append("thumbnail", values[key][0].originFileObj);
        } else {
          formData.append(key, values[key] || ""); // Ensure all fields are sent, even if empty
        }
      });

      const response = await apiService.post(`/workspace/add-workspace/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      message.success("Workspace created successfully");
      router.push(`/${user.role.toLowerCase()}/createspace`);
    } catch (error) {
      console.error("Error creating workspace:", error);
      message.error(error.message || "Failed to create workspace");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle file upload validation
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  if (loading || !user) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Workspace</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ privacy: "public" }}
      >
        <Form.Item
          name="title"
          label="Workspace Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter workspace title" />
        </Form.Item>

        {user.role.toLowerCase() === "provider" ? (
          <Form.Item
            name="providerName"
            label="Provider Name"
            rules={[{ required: true, message: "Please select a provider" }]}
          >
            <AutoComplete
              options={providerOptions}
              onSearch={onSearchProvider}
              placeholder="Search for a provider"
            />
          </Form.Item>
        ) : (
          <Form.Item
            name="providerName"
            label="Provider Name"
            initialValue="ExpertHub"
          >
            <Input value="ExpertHub" disabled />
          </Form.Item>
        )}

        <Form.Item
          name="category"
          label="Category (Space Type)"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select a category">
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="about"
          label="About"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={4} placeholder="Describe the workspace" />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Duration (in hours)"
          rules={[{ required: true, message: "Please enter duration" }]}
        >
          <Input type="number" placeholder="Enter duration" />
        </Form.Item>

        <Form.Item
          name="persons"
          label="Number of Persons"
          rules={[{ required: true, message: "Please enter the number of persons" }]}
        >
          <Input type="number" placeholder="Enter number of persons" min={1} />
        </Form.Item>

        <Form.Item name="startDate" label="Start Date">
          <Input type="date" />
        </Form.Item>

        <Form.Item name="endDate" label="End Date">
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter the location" }]}
        >
          <Input placeholder="Enter location (e.g., Rumuokwurusi Port Harcourt)" />
        </Form.Item>

        <Form.Item name="startTime" label="Start Time">
          <Input type="time" />
        </Form.Item>

        <Form.Item name="endTime" label="End Time">
          <Input type="time" />
        </Form.Item>

        <Form.Item name="workDuration" label="Work Duration">
          <Input placeholder="e.g., 2 weeks" />
        </Form.Item>

        <Form.Item name="fee" label="Fee">
          <Input type="number" placeholder="Enter fee" />
        </Form.Item>

        <Form.Item name="strikedFee" label="Striked Fee">
          <Input type="number" placeholder="Enter striked fee" />
        </Form.Item>

        <Form.Item name="privacy" label="Privacy">
          <Select>
            <Option value="public">Public</Option>
            <Option value="private">Private</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="thumbnail"
          label="Thumbnail"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Please upload a thumbnail" }]}
        >
          <Upload name="thumbnail" listType="picture" maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={formLoading}
            className="bg-primary hover:bg-secondary text-white border-none"
          >
            Create Workspace
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateWorkspace;
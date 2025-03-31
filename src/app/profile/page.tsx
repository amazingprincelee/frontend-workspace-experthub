"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/utils/apiService";
import { notification, Modal, Form, Input, Select, Upload } from "antd";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import { UploadOutlined } from "@ant-design/icons";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  country: string;
  state: string;
  isVerified: boolean;
  profilePicture?: string;
}

const Profile: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [profileForm] = Form.useForm();
  const [detailsForm] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const { user } = useAuth();

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      if (!user?.id) {
        throw new Error("User ID not found");
      }
      const response = await apiService.get(`/user/profile/${user.id}`);
      setProfile(response.data.user);
    } catch (error: any) {
      api.error({
        message: "Failed to fetch profile",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  // Show the profile modal (for image and name)
  const showProfileModal = () => {
    if (profile) {
      profileForm.setFieldsValue({
        fullname: profile.fullName,
      });
      setFileList(
        profile.profilePicture
          ? [
              {
                uid: "-1",
                name: "profile-image",
                status: "done",
                url: profile.profilePicture,
              },
            ]
          : []
      );
    }
    setIsProfileModalVisible(true);
  };

  // Show the details modal (for phone, gender, age, country, state, skillLevel)
  const showDetailsModal = () => {
    if (profile) {
      detailsForm.setFieldsValue({
        phone: profile.phone,
        gender: profile.gender,
        age: profile.age,
        country: profile.country,
        state: profile.state,
      });
    }
    setIsDetailsModalVisible(true);
  };

  // Handle profile modal cancel
  const handleProfileModalCancel = () => {
    setIsProfileModalVisible(false);
    profileForm.resetFields();
    setFileList([]);
  };

  // Handle details modal cancel
  const handleDetailsModalCancel = () => {
    setIsDetailsModalVisible(false);
    detailsForm.resetFields();
  };

  // Handle profile image upload
  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // Handle profile update (image and name)
  const handleUpdateProfile = async (values: any) => {
    try {
      // Update profile image if a new file is uploaded
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append("image", fileList[0].originFileObj);
        await apiService.put(`/user/updateProfilePicture/${user.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Update name only (email is not included)
      await apiService.put(`/user/updateProfile/${user.id}`, {
        fullname: values.fullname,
        assignerId: user.id, // Required by the endpoint
      });

      api.success({
        message: "Profile updated successfully",
      });
      setIsProfileModalVisible(false);
      fetchProfile(); // Refresh profile data
    } catch (error: any) {
      api.error({
        message: "Failed to update profile",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Handle details update (phone, gender, age, country, state, skillLevel)
  const handleUpdateDetails = async (values: any) => {
    try {
      await apiService.put(`/user/updateProfile/${user.id}`, {
        ...values,
        assignerId: user.id, // Required by the endpoint
      });
      api.success({
        message: "Details updated successfully",
      });
      setIsDetailsModalVisible(false);
      fetchProfile(); // Refresh profile data
    } catch (error: any) {
      api.error({
        message: "Failed to update details",
        description: error.response?.data?.message || error.message,
      });
    }
  };

  if (loading) {
    return <div className="text-center p-6 text-gray">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center p-6 text-gray">Profile not found</div>;
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "client", "provider"]}>
      <div className="container mx-auto p-4 sm:p-6 bg-background min-h-screen">
        {contextHolder}
        {/* Personal Details Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-heading font-bold text-black mb-4">
            Personal Details
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 overflow-hidden">
              {profile.profilePicture ? (
                <Image
                  src={profile.profilePicture}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray text-xl font-heading">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-heading font-semibold text-black">
                {profile.fullName}
              </h3>
              <p className="text-xs sm:text-sm text-gray">{profile.email}</p>
            </div>
            <button
              onClick={showProfileModal}
              className="bg-primary text-white font-heading font-semibold text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-lg hover:bg-secondary transition mt-3 sm:mt-0 w-full sm:w-auto"
            >
              Edit profile
            </button>
          </div>
        </div>

        {/* User Details Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-base sm:text-lg font-heading font-semibold text-black mb-4">
            {profile.isVerified ? "Verified Account" : "Unverified Account"}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <p className="text-xs sm:text-sm font-heading text-gray uppercase">
                Phone Number
              </p>
              <p className="text-sm sm:text-base font-heading text-black">
                {profile.phone || "N/A"}
              </p>
            </div>
            <div className="border-b border-gray-200 pb-2">
              <p className="text-xs sm:text-sm font-heading text-gray uppercase">
                Gender
              </p>
              <p className="text-sm sm:text-base font-heading text-black">
                {profile.gender || "N/A"}
              </p>
            </div>
            <div className="border-b border-gray-200 pb-2">
              <p className="text-xs sm:text-sm font-heading text-gray uppercase">
                Age
              </p>
              <p className="text-sm sm:text-base font-heading text-black">
                {profile.age || "N/A"}
              </p>
            </div>
            <div className="border-b border-gray-200 pb-2">
              <p className="text-xs sm:text-sm font-heading text-gray uppercase">
                Country of Residence
              </p>
              <p className="text-sm sm:text-base font-heading text-black">
                {profile.country || "N/A"}
              </p>
            </div>
            <div className="border-b border-gray-200 pb-2">
              <p className="text-xs sm:text-sm font-heading text-gray uppercase">
                State of Residence
              </p>
              <p className="text-sm sm:text-base font-heading text-black">
                {profile.state || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={showDetailsModal}
            className="bg-primary text-white font-heading font-semibold text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-lg hover:bg-secondary transition w-full sm:w-auto mt-4 sm:mt-6"
          >
            Edit
          </button>
        </div>

        {/* Profile Modal (Image and Name) */}
        <Modal
          title={<span className="font-heading font-bold text-black">Edit Profile</span>}
          open={isProfileModalVisible}
          onCancel={handleProfileModalCancel}
          footer={null}
          className="font-heading"
        >
          <Form
            form={profileForm}
            onFinish={handleUpdateProfile}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              label={<span className="text-gray">Profile Image</span>}
            >
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false} // Prevent auto-upload, handle manually
                maxCount={1}
              >
                <button
                  type="button"
                  className="flex items-center space-x-2 bg-gray-200 text-black font-heading font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                >
                  <UploadOutlined />
                  <span>Upload</span>
                </button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="fullname"
              label={<span className="text-gray">Full Name</span>}
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input className="rounded-lg" />
            </Form.Item>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleProfileModalCancel}
                className="bg-gray-200 text-black font-heading font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white font-heading font-semibold py-2 px-4 rounded-lg hover:bg-secondary transition"
              >
                Save Changes
              </button>
            </div>
          </Form>
        </Modal>

        {/* Details Modal (Phone, Gender, Age, Country, State, Skill Level) */}
        <Modal
          title={<span className="font-heading font-bold text-black">Edit Details</span>}
          open={isDetailsModalVisible}
          onCancel={handleDetailsModalCancel}
          footer={null}
          className="font-heading"
        >
          <Form
            form={detailsForm}
            onFinish={handleUpdateDetails}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              name="phone"
              label={<span className="text-gray">Phone Number</span>}
            >
              <Input className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="gender"
              label={<span className="text-gray">Gender</span>}
            >
              <Select className="rounded-lg">
                <Select.Option value="">Select Gender</Select.Option>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Teenager">Teenager</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="age"
              label={<span className="text-gray">Age</span>}
            >
              <Input type="number" className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="country"
              label={<span className="text-gray">Country of Residence</span>}
            >
              <Input className="rounded-lg" />
            </Form.Item>
            <Form.Item
              name="state"
              label={<span className="text-gray">State of Residence</span>}
            >
              <Input className="rounded-lg" />
            </Form.Item>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleDetailsModalCancel}
                className="bg-gray-200 text-black font-heading font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white font-heading font-semibold py-2 px-4 rounded-lg hover:bg-secondary transition"
              >
                Save Changes
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
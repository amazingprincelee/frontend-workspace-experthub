"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaUserPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext"; // Adjust the import path
import apiService from '@/utils/apiService';

interface TeamMember {
  userId: string;
  role: string;
  privileges: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
  joinedAt: string;
}

interface Workspace {
  _id: string;
  title: string;
}

interface UserSearchResult {
  _id: string;
  fullname: string;
  email: string;
}

export default function TeamManagement() {
  const { user, loading: authLoading } = useAuth(); // Get logged-in user (provider)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [emailInput, setEmailInput] = useState<string>(""); // Email input for searching
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // Selected user from search
  const [users, setUsers] = useState<UserSearchResult[]>([]); // Search results
  const [selectedRole, setSelectedRole] = useState<string>("Viewer");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false); // Loading state for search
  const [assignLoading, setAssignLoading] = useState<boolean>(false); // Loading state for assign

  // Fetch user's workspaces
  useEffect(() => {
    if (authLoading || !user?._id) return;
  
    const fetchWorkspaces = async () => {
      try {
        console.log("📦 Fetching workspaces for user:", user._id, "Role:", user.role);
  
        const response = await apiService.get(`/workspaces-by-provider-id/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
  
        console.log("✅ Workspace API raw response:", response);
        console.log("✅ Workspace response data:", response.data);
  
        const fetchedWorkspaces = response.data.workspaces || [];
  
        if (fetchedWorkspaces.length > 0) {
          setWorkspaces(fetchedWorkspaces);
          setSelectedWorkspaceId(fetchedWorkspaces[0]._id);
        } else {
          setWorkspaces([]);
          setError("No workspaces found for this user");
        }
      } catch (err: any) {
        console.error("❌ Workspace fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch workspaces");
      }
    };
  
    fetchWorkspaces();
  }, [user, authLoading]);
  

  // Fetch team members when workspace changes
  useEffect(() => {
    if (!selectedWorkspaceId || !user?._id) return;

    const fetchTeamMembers = async () => {
      try {
        const response = await apiService.get(`/workspace/${selectedWorkspaceId}`, {
          params: { adminId: user._id },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTeamMembers(response.data.workspace.teamMembers || []);
      } catch (err) {
        setError("Failed to fetch team members");
        console.error(err);
      }
    };

    fetchTeamMembers();
  }, [selectedWorkspaceId, user]);

  // Search users when the button is clicked
  const handleSearchUsers = async () => {
    if (!emailInput) {
      setError("Please enter an email to search");
      setUsers([]);
      setSelectedUserId(null);
      return;
    }

    setSearchLoading(true); // Set search loading to true
    try {
      const response = await apiService.get(
        `/workspace/search-users-by-email?email=${emailInput}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(response.data.users || []);
      if (response.data.users.length > 0) {
        setSelectedUserId(response.data.users[0]._id); // Default to first user
        setError(null);
      } else {
        setError("No users found with this email");
        setSelectedUserId(null);
      }
    } catch (err) {
      setError("Failed to search users: " + (err.response?.status || "Unknown error"));
      setUsers([]);
      setSelectedUserId(null);
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false); // Reset search loading state
    }
  };

  // Assign a new team member by selected user
  const handleAssignTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id || !selectedWorkspaceId || !selectedUserId) {
      setError("Please select a workspace and a user");
      return;
    }

    setAssignLoading(true); // Set assign loading to true
    console.log("Assigning team member:", {
      workspaceId: selectedWorkspaceId,
      userId: selectedUserId,
      role: selectedRole,
    }); // Debug log
    try {
      const response = await apiService.post(
        `/workspace/assign-team-member-by-email/${selectedWorkspaceId}`,
        {
          userId: selectedUserId,
          role: selectedRole,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Assign response:", response.data); // Debug log

      const newMember = {
        userId: selectedUserId,
        role: selectedRole,
        privileges: { canCreate: false, canEdit: false, canDelete: false },
        joinedAt: new Date().toISOString(),
      };

      setTeamMembers([...teamMembers, newMember]);
      setEmailInput("");
      setSelectedUserId(null);
      setUsers([]);
      setSelectedRole("Viewer");
      setError(null);
      setSuccessMessage("Team member assigned successfully");
    } catch (err: any) {
      console.error("Assign error:", err.response?.data || err.message); // Detailed error log
      setError(err.response?.data?.message || "Failed to assign team member");
      setSuccessMessage(null);
    } finally {
      setAssignLoading(false); // Reset assign loading state
    }
  };

  // Update team member role
  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!user?._id || !selectedWorkspaceId) return;

    try {
      await apiService.put(
        `/workspace/update-team-member/${selectedWorkspaceId}`,
        {
          userId,
          role: newRole,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTeamMembers(
        teamMembers.map((member) =>
          member.userId === userId
            ? {
                ...member,
                role: newRole,
                privileges:
                  newRole === "Admin"
                    ? { canCreate: true, canEdit: true, canDelete: true }
                    : newRole === "Editor"
                    ? { canCreate: true, canEdit: true, canDelete: false }
                    : { canCreate: false, canEdit: false, canDelete: false },
              }
            : member
        )
      );
      setError(null);
      setSuccessMessage("Team member role updated successfully");
    } catch (err) {
      setError("Failed to update role");
      setSuccessMessage(null);
      console.error(err);
    }
  };

  // Remove team member
  const handleRemoveTeamMember = async (userId: string) => {
    if (!user?._id || !selectedWorkspaceId) return;

    try {
      await apiService.delete(`/workspace/remove-team-member/${selectedWorkspaceId}/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeamMembers(teamMembers.filter((member) => member.userId !== userId));
      setError(null);
      setSuccessMessage("Team member removed successfully");
    } catch (err) {
      setError("Failed to remove team member");
      setSuccessMessage(null);
      console.error(err);
    }
  };

  if (authLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to manage team members.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Team Members</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Select Workspace */}
      <div className="mb-6 p-4 bg-white shadow rounded">
        <label className="block text-sm font-medium text-gray-700">Select Workspace</label>
        <select
          value={selectedWorkspaceId}
          onChange={(e) => setSelectedWorkspaceId(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select a workspace</option>
          {workspaces.map((workspace) => (
            <option key={workspace._id} value={workspace._id}>
              {workspace.title}
            </option>
          ))}
        </select>
      </div>

      {/* Assign New Team Member Form */}
      <form onSubmit={handleAssignTeamMember} className="mb-6 p-4 bg-white shadow rounded">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Enter User Email</label>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter user email"
              required
            />
            <button
              type="button"
              onClick={handleSearchUsers}
              className="mt-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center disabled:bg-orange-300"
              disabled={searchLoading}
            >
              {searchLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Searching...
                </span>
              ) : (
                <>
                  <FaSearch className="mr-2" /> Search
                </>
              )}
            </button>
          </div>
          {users.length > 0 && (
            <select
              value={selectedUserId || ""}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullname} ({user.email})
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="Viewer">Viewer</option>
            <option value="Editor">Editor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center disabled:bg-orange-300"
          disabled={!selectedWorkspaceId || !selectedUserId || assignLoading}
        >
          {assignLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Assigning...
            </span>
          ) : (
            <>
              <FaUserPlus className="mr-2" /> Assign
            </>
          )}
        </button>
      </form>

      {/* Team Members List */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Team Members</h3>
        {teamMembers.length === 0 ? (
          <p>No team members assigned yet.</p>
        ) : (
          <ul className="space-y-2">
            {teamMembers.map((member) => (
              <li key={member.userId} className="flex justify-between items-center p-2 border-b">
                <span>{member.userId} - {member.role}</span>
                <div>
                  <select
                    value={member.role}
                    onChange={(e) => handleUpdateRole(member.userId, e.target.value)}
                    className="mr-2 p-1 border rounded"
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleRemoveTeamMember(member.userId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
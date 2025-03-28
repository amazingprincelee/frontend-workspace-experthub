// contexts/WorkspaceContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiService from "@/utils/apiService";

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        setLoading(false);
        return;
      }

      const response = await apiService.get(`/workspace/all?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWorkspaces(response.data.workspaces || {});
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkspaceContext.Provider value={{ workspaces, fetchWorkspaces, loading }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaces = () => useContext(WorkspaceContext);
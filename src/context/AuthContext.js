// AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiService from "@/utils/apiService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    // Fetch complete user profile using user ID
    const fetchUserProfile = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token || !userId) {
                setLoading(false);
                return;
            }

            const response = await apiService.get(`/user/profile/${userId}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setUser(response.data.user);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setUser(null);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId"); // We'll store this on login
        if (token && storedUserId) {
            fetchUserProfile(storedUserId);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        setAuthLoading(true);
        try {
            // First, perform login
            const loginResponse = await apiService.post("/auth/login", credentials, {
                withCredentials: true,
            });

            if (!loginResponse.data || !loginResponse.data.accessToken) {
                throw new Error(loginResponse.data.message || "Invalid credentials");
            }

            const userId = loginResponse.data.userId || loginResponse.data.user?.id;
            if (!userId) {
                throw new Error("User ID not found in login response");
            }

            localStorage.setItem("token", loginResponse.data.accessToken);
            localStorage.setItem("userId", userId);

            // Fetch complete profile using the user ID
            const profileResponse = await apiService.get(`/user/profile/${userId}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${loginResponse.data.accessToken}`,
                },
            });

            setUser(profileResponse.data.user);
            return profileResponse.data.user;
        } catch (error) {
            console.error("Login failed:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            return false;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        setAuthLoading(true);
        console.log("Starting logout..."); // Debug log
        try {
          const token = localStorage.getItem("token");
          console.log("Token before logout:", token); // Debug log
          await apiService.get("/auth/logout", {}, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("API logout succeeded"); // Debug log
        } catch (error) {
          console.error("Logout API failed:", error); // Log the error but proceed
        }
        // Always clear state and localStorage, even if API fails
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        console.log("Token after logout:", localStorage.getItem("token")); // Should be null
        setAuthLoading(false);
      };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

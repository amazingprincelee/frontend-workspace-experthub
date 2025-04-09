"use client";

import React, { useEffect, useState } from "react";
import { Dropdown, notification as antdNotification } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/utils/apiService";
import HeaderNav from "./HeaderNav";

const AuthHeaderNav = ({ setToggle }: { setToggle?: () => void }) => {
  const { user, loading: authLoading, logout: contextLogout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu visibility
  const router = useRouter();

  // Fetch notifications when user is available
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;

      setLoadingNotifications(true);
      try {
        const token = localStorage.getItem("token");
        const response = await apiService.get(`/space-notifications/all/${user.id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        antdNotification.error({
          message: "Error",
          description: "Could not load notifications.",
        });
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Logout handler
  const handleLogout = async () => {
    try {
      console.log("Attempting logout...");
      await contextLogout();
      antdNotification.success({
        message: "Logout Successful",
        description: "You have been logged out.",
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      antdNotification.error({
        message: "Logout Failed",
        description: error.message || "An error occurred while logging out.",
      });
    }
  };

  // Dynamic dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user || !user.role) return "/";
    switch (user.role.toLowerCase()) {
      case "admin":
        return "/admin/dashboard";
      case "client":
        return "/client/dashboard";
      case "provider":
        return "/provider/dashboard";
      default:
        return "/";
    }
  };

  // Handle dashboard link click
  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const route = getDashboardRoute();
    router.push(route);
    setIsMenuOpen(false); // Close the menu after clicking a link
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (setToggle) {
      setToggle(); // Call the parent setToggle if provided
    }
  };

  // Notification dropdown items
  const notificationItems: MenuProps["items"] = notifications.length
    ? notifications.map((notif, index) => ({
        key: index,
        label: (
          <div>
            <p className="font-medium">{notif.title}</p>
            <p>{notif.body}</p>
            {!notif.read && (
              <button
                onClick={async () => {
                  try {
                    await apiService.get(
                      `/notifications/mark-as-read/${notif._id}`,
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "token"
                          )}`,
                        },
                      }
                    );
                    setNotifications((prev) =>
                      prev.map((n) =>
                        n._id === notif._id ? { ...n, read: true } : n
                      )
                    );
                  } catch (error) {
                    console.error("Failed to mark as read:", error);
                  }
                }}
                className="text-blue-500"
              >
                Mark as Read
              </button>
            )}
          </div>
        ),
      }))
    : [{ key: "0", label: "No notifications" }];

  // Profile dropdown items
  const profileItems: MenuProps["items"] = [
    { key: "1", label: <Link href="/profile">Profile</Link> },
    { key: "2", label: <Link href="/wallet">Wallet</Link> },
    { key: "3", label: <Link href="/yourplan">Your Plan</Link> },
    {
      key: "4",
      label: (
        <button
          onClick={handleLogout}
          className="text-red-500 w-full text-left"
        >
          Logout
        </button>
      ),
    },
  ];

  // If user data is still loading or user is not available, render the HeaderNav component
  if (authLoading || !user) {
    return <HeaderNav />;
  }

  // Render the authenticated navigation bar once user data is available
  return (
    <section className="fixed top-0 left-0 w-full bg-[#F8F7F4] z-50 shadow-[0px_1px_2.8px_0px_#1E1E1E38]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Section: Hamburger + Welcome */}
        <div className="flex items-center space-x-4">
          <div className="lg:hidden">
            <img
              onClick={toggleMenu}
              src="/images/hamburger.png"
              className="w-8 h-8 cursor-pointer"
              alt="Menu"
              aria-label="Toggle navigation menu"
            />
          </div>
          <div className="hidden lg:block">
            <p className="font-medium text-sm">Welcome</p>
            <p className="font-bold capitalize text-lg">{user.fullName}</p>
          </div>
        </div>

        {/* Center Section: Navigation Links */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex flex-1 justify-center absolute lg:static top-16 left-0 w-full bg-[#F8F7F4] lg:bg-transparent shadow-lg lg:shadow-none z-40`}
        >
          <ul className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8 p-4 lg:p-0">
            <li>
              <a
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col lg:flex-row items-center gap-1 text-sm hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-house"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5.5V7.207l5-5z" />
                </svg>
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={handleDashboardClick}
                className="flex flex-col lg:flex-row items-center gap-1 text-sm hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-speedometer2"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z" />
                  <path
                    fillRule="evenodd"
                    d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.277 12 8 12s3.604.533 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z"
                  />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/faq"
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col lg:flex-row items-center gap-1 text-sm hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-question-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm5.255 3.605a.905.905 0 1 1 1.81 0 .905.905 0 0 1-1.81 0zM8.93 6.588c.586-.53.741-1.056.688-1.482-.065-.5-.537-.987-1.389-.987-.746 0-1.318.46-1.39 1.132-.073.681.387 1.047.93 1.29.51.227.692.375.683.793-.008.357-.211.579-.655.679-.42.094-.756-.093-.982-.253a.531.531 0 0 0-.657.057c-.195.195-.177.508.032.682.376.318.907.466 1.555.364.66-.103 1.262-.437 1.272-1.353.006-.628-.245-.997-.855-1.295z" />
                </svg>
                Faq
              </a>
            </li>
            <li>
              <a
                href="/announcement"
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col lg:flex-row items-center gap-1 text-sm hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-megaphone-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 3v10l4 2V1l-4 2zM1.5 6h3v4h-3v1h3.5l2.5 3v-11l-2.5 3H1.5v1z" />
                </svg>
                Announcement
              </a>
            </li>
          </ul>
        </nav>

        {/* Right Section: Notifications + Profile */}
        <div className="flex items-center space-x-4">
          <Dropdown menu={{ items: notificationItems }} trigger={["click"]}>
            <button className="relative p-2 rounded-full shadow-md hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-bell"
                viewBox="0 0 16 16"
              >
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 0 1 1.99 0C11.28 1.56 13 3.58 13 6c0 .88.32 4.2 1.22 6z" />
              </svg>
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </Dropdown>
          <Dropdown menu={{ items: profileItems }} trigger={["click"]}>
            <img
              className="h-10 w-10 rounded-full cursor-pointer"
              src={user.profilePicture || "/images/user.png"}
              alt="Profile"
            />
          </Dropdown>
        </div>
      </div>
    </section>
  );
};

export default AuthHeaderNav;
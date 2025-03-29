// components/ReservationSearch.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import apiService from "@/utils/apiService";
import { message } from "antd";
import Loader from "@/components/FetchLoader";

interface Filter {
  spaceType: string;
  date: string;
  timeFrom: string;
  timeUntil: string;
  numberOfPeople: string;
  location: string;
}

interface Workspace {
  _id: string;
  title: string;
  providerName: string;
  startDate: string;
  thumbnail: { url: string };
  startTime: string;
  endTime: string;
}

const WorkspaceReservation: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [filters, setFilters] = useState<Filter>({
    spaceType: "",
    date: "",
    timeFrom: "",
    timeUntil: "",
    numberOfPeople: "1",
    location: "",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [timeOptions, setTimeOptions] = useState<{ from: string[]; to: string[] }>({ from: [], to: [] });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories and default workspaces on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories for the "Space Type" dropdown
        const categoryResponse = await apiService.get("/workspace/all/category");
        const categoryNames = categoryResponse.data.categories.map((cat: { name: string }) => cat.name);
        setCategories(categoryNames);

        // Fetch default workspaces (limited to 2)
        try {
          const defaultWorkspacesResponse = await apiService.get("/workspace/default-workspaces");
          console.log("Fetched Workspaces:", defaultWorkspacesResponse.data.workspaces);
          const defaultWorkspaces: Workspace[] = defaultWorkspacesResponse.data.workspaces || [];
          setWorkspaces(defaultWorkspaces);

          // Extract unique startTime and endTime for the "From" and "To" dropdowns
          const fromTimes = Array.from(new Set<string>(defaultWorkspaces.map((ws) => ws.startTime).filter(Boolean)));
          const toTimes = Array.from(new Set<string>(defaultWorkspaces.map((ws) => ws.endTime).filter(Boolean)));
          setTimeOptions({ from: fromTimes, to: toTimes });
        } catch (error) {
          console.error("Error fetching workspaces:", error?.response?.data || error);
          if (error?.response?.status === 401) {
            message.info("Please log in to view workspaces");
            setWorkspaces([]);
            setTimeOptions({ from: [], to: [] });
          } else {
            throw error; // Re-throw other errors
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error?.response?.data || error);
        message.error("Failed to load initial data");
        setWorkspaces([]);
        setTimeOptions({ from: [], to: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.post("/workspace/category", filters);
      const filteredWorkspaces: Workspace[] = response.data.workspaces;
      setWorkspaces(filteredWorkspaces);

      // Update time options based on filtered results
      const fromTimes = Array.from(new Set<string>(filteredWorkspaces.map((ws) => ws.startTime).filter(Boolean)));
      const toTimes = Array.from(new Set<string>(filteredWorkspaces.map((ws) => ws.endTime).filter(Boolean)));
      setTimeOptions({ from: fromTimes, to: toTimes });
    } catch (error) {
      console.error("Error applying filters:", error?.response?.data || error);
      message.error("Failed to fetch workspaces");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserveClick = (workspaceId: string) => {
    if (!user) {
      message.error("Please log in to reserve a workspace");
      router.push("/auth/login");
      return;
    }

    if (user.role.toLowerCase() !== "client") {
      message.error("Only clients can reserve a workspace");
      return;
    }

    router.push(`/reserve/${workspaceId}`);
  };

  if (authLoading) {
    return <Loader />;
  }

  return (
    <div className="container p-6 mt-5 mb-24">
      {/* Filters */}
      <div className="container lg:flex lg:flex-wrap justify-center items-center gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="space-type">Space Type</label>
          <select
            id="space-type"
            name="spaceType"
            value={filters.spaceType}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Select Space Type</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="from">From</label>
          <select
            id="from"
            name="timeFrom"
            value={filters.timeFrom}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Select Time</option>
            {timeOptions.from.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="to">To</label>
          <select
            id="to"
            name="timeUntil"
            value={filters.timeUntil}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Select Time</option>
            {timeOptions.to.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="persons">Number of Persons</label>
          <input
            id="persons"
            type="number"
            name="numberOfPeople"
            placeholder="Number of People"
            value={filters.numberOfPeople}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
            min="1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            name="location"
            placeholder="Enter a city"
            value={filters.location}
            onChange={handleFilterChange}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="btn">.</label>
          <button
            id="btn"
            onClick={applyFilters}
            className="bg-primary m-2 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Filtering..." : "Filter"}
          </button>
        </div>
      </div>

      {/* Workspace List */}
      {isLoading ? (
        <div className="text-center">Loading workspaces...</div>
      ) : workspaces.length === 0 ? (
        <div className="text-center">No workspaces found</div>
      ) : (
        <div className="container lg:w-[1110px] grid grid-cols-1 md:grid-cols-2 gap-4">
          {workspaces.map((workspace) => (
            <div
              key={workspace._id}
              className="border rounded-lg shadow-lg lg:flex items-center p-4"
            >
              <img
                src={workspace.thumbnail.url}
                alt={workspace.title}
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div className="flex-grow mb-2">
                <h3 className="text-lg font-semibold">{workspace.title}</h3>
                <p className="text-sm text-gray-500">{workspace.providerName}</p>
                <p className="text-sm text-gray-500">{workspace.startDate}</p>
              </div>
              <button
                onClick={() => handleReserveClick(workspace._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Reserve Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspaceReservation;
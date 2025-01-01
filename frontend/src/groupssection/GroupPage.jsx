import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext";
import GroupCard from "./GroupCard";
import GroupCardModal from "./GroupCardModal";
import Header from "../components/Header";

const GroupsPage = () => {
  const { user } = useUser();
  const { isDarkMode } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [allowedDomains, setAllowedDomains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and sort groups by visibility
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/group/get`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        // Sort groups: public first, then private
        const sortedGroups = response.data.sort((a, b) => {
          if (a.visibility === "public" && b.visibility !== "public") return -1;
          if (a.visibility !== "public" && b.visibility === "public") return 1;
          return 0; // If both have the same visibility, maintain original order
        });
        setGroups(sortedGroups);
        setFilteredGroups(sortedGroups); // Initialize filtered groups with sorted data
      } catch (error) {
        toast.error("Failed to fetch groups.");
        setError("Failed to fetch groups.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // Filter groups based on search query
  useEffect(() => {
    const filterGroups = () => {
      if (!searchQuery) {
        setFilteredGroups(groups);
        return;
      }

      const queryWords = searchQuery.toLowerCase().split(/\s+/); // Split query into words
      const filtered = groups.filter((group) => {
        const { name, description } = group;
        const text = `${name} ${description}`.toLowerCase();
        return queryWords.some((word) => text.includes(word)); // Match any word
      });

      setFilteredGroups(filtered);
    };

    filterGroups();
  }, [searchQuery, groups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName || !groupDescription) {
      toast.error("Name and description are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/group/create`,
        {
          name: groupName,
          description: groupDescription,
          details: additionalDetails,
          visibility,
          allowedDomains,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setGroups([...groups, response.data]);
      toast.success("Group created successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating group:", error); // Log the error on frontend
      toast.error(error.response?.data?.message || "Failed to create group.");
    }
  };
   

  // const alternatingColors = ['bg-pink-100', 'bg-blue-100'];
  const getCardColor = (index, columns, isDarkMode) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
  
    const isEvenRow = row % 2 === 0;
    const isEvenCol = col % 2 === 0;
  
    if (isDarkMode) {
      // Colors for dark mode
      if (isEvenRow) {
        return isEvenCol ? "bg-gray-950 text-gray-200" : "bg-gray-800 text-gray-300";
      } else {
        return isEvenCol ? "bg-gray-800 text-gray-300" : "bg-gray-950 text-gray-200";
      }
    } else {
      // Colors for light mode
      if (isEvenRow) {
        return isEvenCol ? "bg-blue-100 text-gray-900" : "bg-orange-100 text-gray-900";
      } else {
        return isEvenCol ? "bg-orange-100 text-gray-900" : "bg-blue-100 text-gray-900";
      }
    }
  };
  





  return (
    <div className="p-6 h-screen overflow-y-auto  bg-white dark:bg-gray-900">
      <div className="fixed top-0 left-0 lg:ml-60 md:ml-0 right-0 z-20   dark:bg-gray-800 shadow">
        <Header onSearch={setSearchQuery} />
      </div>

      <div className="flex justify-between items-center mt-16">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Groups
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Create Group"
        >
          Create Group
        </button>
      </div>

      {loading && <div className="text-center mt-4">Loading groups...</div>}
      {error && <div className="text-center text-red-500 mt-4">{error}</div>}

      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {filteredGroups.map((group,index) => (
            <GroupCard
              key={group._id}
              group={group}
              bgColor={getCardColor(index, 4,isDarkMode)}// Assign color based on index
      
            />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className="text-center text-gray-500 mt-8">No groups available.</div>
        )
      )}

      <GroupCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateGroup}
        groupName={groupName}
        groupDescription={groupDescription}
        additionalDetails={additionalDetails}
        setGroupName={setGroupName}
        setGroupDescription={setGroupDescription}
        setAdditionalDetails={setAdditionalDetails}
        setVisibility={setVisibility}
        setAllowedDomains={setAllowedDomains}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default GroupsPage;

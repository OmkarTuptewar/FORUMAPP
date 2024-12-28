import React, { useState } from "react";
import PropTypes from "prop-types";

const GroupCardModal = ({
  isOpen,
  onClose,
  onSubmit,
  groupName,
  groupDescription,
  additionalDetails,
  setGroupName,
  setGroupDescription,
  setAdditionalDetails,
  setVisibility,
  setAllowedDomains,
  isDarkMode,
}) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const universities = [
    { value: "harvard.edu", label: "Harvard University" },
    { value: "stanford.edu", label: "Stanford University" },
    { value: "mit.edu", label: "Massachusetts Institute of Technology" },
    { value: "ucberkeley.edu", label: "University of California, Berkeley" },
    { value: "ox.ac.uk", label: "University of Oxford" },
    { value: "cam.ac.uk", label: "University of Cambridge" },
    { value: "princeton.edu", label: "Princeton University" },
    { value: "caltech.edu", label: "California Institute of Technology" },
    { value: "yale.edu", label: "Yale University" },
    { value: "columbia.edu", label: "Columbia University" },
    { value: "upenn.edu", label: "University of Pennsylvania" },
    { value: "chicago.edu", label: "University of Chicago" },
    { value: "cornell.edu", label: "Cornell University" },
    { value: "nyu.edu", label: "New York University" },
    { value: "duke.edu", label: "Duke University" },
    { value: "northwestern.edu", label: "Northwestern University" },
    { value: "berkeley.edu", label: "University of California, Berkeley" },
    { value: "ucla.edu", label: "University of California, Los Angeles" },
    { value: "purdue.edu", label: "Purdue University" },
  ];

  if (!isOpen) return null;

  const handleVisibilityChange = (e) => {
    const isPrivateSelected = e.target.value === "private";
    setIsPrivate(isPrivateSelected);
    setVisibility(e.target.value);
  };

  const handleDomainSelect = (e) => {
    const { value, checked } = e.target;
    
    setSelectedDomains((prev) => {
      const newSelectedDomains = checked
        ? [...prev, value]  // Add domain if checked
        : prev.filter((domain) => domain !== value); // Remove domain if unchecked
      
      // Remove duplicates in allowedDomains (if any)
      const uniqueSelectedDomains = [...new Set(newSelectedDomains)];
      
      setAllowedDomains(uniqueSelectedDomains); // Update allowedDomains with unique values
      
      return uniqueSelectedDomains;
    });
  };
  const handleSelectAll = () => {
    const allDomains = universities.map((univ) => univ.value);
    setSelectedDomains(allDomains);
    setAllowedDomains(allDomains);
  };

  // Filter universities based on search term
  const filteredUniversities = universities.filter((univ) =>
    univ.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div
  className={`${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"} 
    w-2/3 
    md:${isPrivate ? "w-2/3 " : "w-1/3"} 
    lg:${isPrivate ? "w-2/3 " : "w-1/3"} 
    xl:${isPrivate ? "w-2/3 " : "w-1/3"} 
    p-6 rounded-lg shadow-lg flex flex-col space-y-4`}
>

        <h2 className="text-lg font-semibold mb-3">Create Group</h2>
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          <div className="flex space-x-6">
            {/* Left side: Group Name and Description */}
            <div className="flex-1">
              <div className="mb-4">
                <label
                  className={`block text-sm py-1 font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Group Name*
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-100 border-gray-600"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className={`block text-sm py-1 font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Group Description*
                </label>
                <textarea
                  className={`w-full p-2 border rounded ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-100 border-gray-600"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  className={`block text-sm py-1 font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Visibility*
                </label>
                <select
                  className={`w-full p-2 border rounded ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-100 border-gray-600"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                  onChange={handleVisibilityChange}
                  required
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {/* Right side: Domain Restrictions (Visible only for Private groups) */}
            {isPrivate && (
              <div className="flex-1">
                <div className="mb-4">
                  <label
                    className={`block text-sm py-1 font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Allowed Domains*
                  </label>
                  <div>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-blue-500 text-sm mb-2"
                    >
                      Select All
                    </button>
                    <input
                      type="text"
                      placeholder="Search Domains..."
                      className={`w-full p-2 mb-2 border rounded ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-100 border-gray-600"
                          : "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filteredUniversities.map((univ) => (
                        <label key={univ.value} className="flex items-center">
                          <input
                            type="checkbox"
                            value={univ.value}
                            onChange={handleDomainSelect}
                            checked={selectedDomains.includes(univ.value)}
                            className="mr-2"
                          />
                          {univ.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium rounded bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

GroupCardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  groupName: PropTypes.string.isRequired,
  groupDescription: PropTypes.string.isRequired,
  additionalDetails: PropTypes.string,
  setGroupName: PropTypes.func.isRequired,
  setGroupDescription: PropTypes.func.isRequired,
  setAdditionalDetails: PropTypes.func.isRequired,
  setVisibility: PropTypes.func.isRequired,
  setAllowedDomains: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default GroupCardModal;

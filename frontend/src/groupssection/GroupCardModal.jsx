import React from "react";
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
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        } w-96 p-6 rounded-lg shadow-lg`}
      >
        <h2 className="text-lg font-semibold mb-3">Create Group</h2>
        <form onSubmit={onSubmit}>
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
              Additional Details
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
            />
          </div>

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
  isDarkMode: PropTypes.bool.isRequired,
};

export default GroupCardModal;

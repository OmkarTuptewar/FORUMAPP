import React from 'react';

const SidebarToggle = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-0 left-0 p-4 text-gray-800 bg-gray-100 hover:bg-gray-400 transition"
    >
      ☰
    </button>
  );
};

export default SidebarToggle;

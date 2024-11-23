import React, { useState } from "react";

const UploadProgressWidget = ({ curFileNumber, totalFiles }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white shadow-lg border border-gray-300 rounded-lg p-4 w-72 transition-all ${
        isExpanded ? "h-auto" : "h-12"
      }`}
    >
      {isExpanded && (
          <div className="flex items-center space-x-2">
            <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6 animate-spin"></div>
            <p>
              Uploading File {curFileNumber}/{totalFiles}
            </p>
          </div>   
      )}
    </div>
  );
};

export default UploadProgressWidget;
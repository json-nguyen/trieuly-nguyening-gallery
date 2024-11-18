import React, { useState } from 'react';
import { toast } from "react-toastify";

const FileUploader = () => {
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setUploading(true);

      // Validate files (e.g., check types and size)
      const validFiles = Array.from(files).filter((file) => {
        const validTypes = ["image/jpeg", "image/png", "video/mp4"];
        const maxSizeMB = 5; // 5MB limit
        return validTypes.includes(file.type) && file.size <= maxSizeMB * 1024 * 1024;
      });

      if (validFiles.length === 0) {
        toast.error("No valid files selected. Ensure they are images or videos within 5MB.");
        setUploading(false);
        return;
      }

      // Upload valid files
      try {
        await onUpload(validFiles); // Replace with your upload function
        toast.error("Files uploaded successfully!");
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="hidden" // Hide default input
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="bg-light-purple text-white font-bold py-3 px-10 text-md rounded-md flex items-center justify-center gap-3 hover:bg-light-purple/80 active:bg-clicked-purple transition duration-300 ease-in-out cursor-pointer
                  w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
      >
        Select Photos/Videos
      </label>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={() => toast.error("Files Successfully Uploaded")}
        className="bg-blue-600 text-white font-bold py-2 px-6 mt-4 rounded-md hover:bg-blue-700 transition duration-300"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUploader;
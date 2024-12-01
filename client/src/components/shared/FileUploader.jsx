import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../services/firebase';
import UploadProgressWidget from "./UploadProgressWidget/UploadProgressWidget";
import { v4 as uuidv4 } from 'uuid';
import path from "path";

const FileUploader = ({ folderName }) => {
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState([]);

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
  const maxFileSize = 20 * 1024 * 1024; 

  const handleFileChange = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const uploadQueue = Array.from(files).map((file) => ({
        file,
        progress: 0,
        status: "uploading",
      }));
      setUploads(uploadQueue);
      setUploading(true)

      const uploadPromises = Array.from(files).map((file, index) => {
        return new Promise((resolve, reject) => {
          const fileExtension = file.name.substring(file.name.lastIndexOf("."));
          const uploadPath = `${folderName}/${uuidv4()}${fileExtension}`
          console.log("uploading", uploadPath)
          const storageRef = ref(storage, uploadPath);

          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploads((prev) =>
                prev.map((u, i) => (i === index ? { ...u, progress } : u))
              );
            },
            (error) => {
              console.error("Upload failed:", error);
              setUploads((prev) =>
                prev.map((u, i) => (i === index ? { ...u, status: "error" } : u))
              );
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploads((prev) =>
                prev.map((u, i) => (i === index ? { ...u, status: "completed", url: downloadURL } : u))
              );
              resolve();  
            }
          );
        });
      });

      try {
        await Promise.all(uploadPromises);
        handleUploadComplete();
      } catch (error) {
        console.log("Error uploading file", error)
      }
    }
  };

  const handleUploadComplete = () => {
    setUploading(false)
    toast.success("Files uploaded!")
  }

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
      {uploading && (
        <UploadProgressWidget
          curFileNumber={uploads.filter(u => u.status === "completed").length + 1}
          totalFiles={uploads.length}
        />
      )}
      
    </div>
  );
};

export default FileUploader;
import React, { useState } from 'react';
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../services/firebase';

const FileUploader = ({ folderName }) => {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
  const maxFileSize = 20 * 1024 * 1024; // 5MB

  const handleFileChange = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      setUploading(true);

      // Validate files
      const validFiles = Array.from(files).filter((file) => {
        return allowedTypes.includes(file.type) && file.size <= maxFileSize;
      });

      if (validFiles.length === 0) {
        toast.error("No valid files selected. Ensure they are images or videos within 5MB.");
        setUploading(false);
        return;
      }

      for (const file of validFiles) {
        // Upload files to firebase with filepath.
        const fileRef = ref(storage, `${folderName}/${file.name}-${Date.now()}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Optionally, you can track progress here
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Upload failed:", error);
            toast.error(`Failed to upload ${file.name}. Please try again.`);
          },
          async () => {
            // Upload completed, get download URL
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File available at:", downloadURL);
              toast.success(`${file.name} uploaded successfully!`);
            } catch (err) {
              console.error("Error fetching download URL:", err);
              toast.error(`Error fetching download URL for ${file.name}.`);
            }
          }
        );
      }
      setUploading(false);
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
    </div>
  );
};

export default FileUploader;
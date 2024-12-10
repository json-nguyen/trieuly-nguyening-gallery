import React, { useState, useRef } from 'react';
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from '../../services/firebase';
import UploadProgressWidget from "./UploadProgressWidget/UploadProgressWidget";
import { v4 as uuidv4 } from 'uuid';
import { generateTimestamp } from '../../utils/time';
import { ArrowUpOnSquareIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import StyledButton from './StyledButton';
const FileUploader = ({ folderName, onFileUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const fileInputRef = useRef(null); // Create a ref for the file input

  async function waitForThumbnail(thumbnailPath, maxRetries = 50, delayMs = 2000) {
    let retries = 0;
  
    while (retries < maxRetries) {
      try {
        console.log(`Retry number ${retries} for path ${thumbnailPath}`)
        const thumbnailRef = ref(storage, thumbnailPath);
        const thumbnailUrl = await getDownloadURL(thumbnailRef);
        return thumbnailUrl; // Return if successful
      } catch (error) {
        console.log(error.code)
        if (error.code === "storage/object-not-found") {
          // Thumbnail not found yet, wait and retry
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          retries++;
        } else {
          // Other errors should be logged and rethrown
          console.error("Error fetching thumbnail:", error);
          throw error;
        }
      }
    }
  
    throw new Error("Thumbnail generation timed out.");
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    
    const validFiles = files.filter((file) => {
      const typeCategory = file.type.split('/')[0]; // Get 'image' or 'video'
      return typeCategory === 'image' || typeCategory === 'video';
    });
    
    const invalidFilesCount = files.length - validFiles.length;

    if (invalidFilesCount > 0) {
      toast.error(
        `${invalidFilesCount} file(s) were not valid and will not be uploaded. Files must be images or videos.`
      );    }

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
          const uuid = uuidv4()
          const timestamp = generateTimestamp()
          const uploadPath = `${folderName}/${timestamp}_${uuid}${fileExtension}`
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
              const metadata = await getMetadata(uploadTask.snapshot.ref);
              const isVideo = metadata.contentType.startsWith("video");
              let imageUrl = downloadURL;
              if (isVideo) {
                const thumbnailPath = `${folderName}/thumbnails/${timestamp}_${uuid}-thumbnail.jpg`;
                try {
                  imageUrl = await waitForThumbnail(thumbnailPath);
                } catch (error) {
                  console.error("Failed to fetch video thumbnail:", error);
                  imageUrl = downloadURL; // Fall back to original video URL if thumbnail fetch fails
                }
              }

              setUploads((prev) =>
                prev.map((u, i) => (i === index ? { ...u, status: "completed", url: downloadURL } : u))
              );

              const uploadedFile = {
                src: imageUrl,
                originalUrl: downloadURL,
                title: file.name,
                type: isVideo ? "video" : "image",
                width: 1920, // Adjust with actual width if necessary
                height: 1080, // Adjust with actual height if necessary
              }

              onFileUpload(uploadedFile)
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
    <div>
      <input
        ref={fileInputRef} // Assign the ref to the file input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="hidden" // Hide default input
        id="file-input"
        disabled={uploading} // Disable the input while uploading
      />
        <StyledButton
          icon={<ArrowUpTrayIcon className="h-6 w-6"/>}
          onClick={handleClick} // Trigger file input click on button click
          buttonText= {uploading ? "Uploading..." : "Select Photos/Videos"}
          disabled={uploading}
        />    
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
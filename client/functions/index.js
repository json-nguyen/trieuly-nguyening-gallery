const {onObjectFinalized} = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");
const ffmpeg = require("fluent-ffmpeg");
const os = require("os");
const path = require("path");
const fs = require("fs").promises;

admin.initializeApp();

const storage = getStorage();
exports.generateVideoThumbnail = onObjectFinalized({region: 'us-east1'}, async (event) => {
    const filePath = event.data.name;  // e.g., "album1/video1.mp4"
    const fileBucket = event.data.bucket;
    const fileName = path.basename(filePath); // e.g., "video1.mp4"
    const contentType = event.data.contentType; // Get the MIME type

    console.log ("Uploading", fileName)
    if (!contentType || !contentType.startsWith("video/")) {
      console.log("Not a video file.");
      return null;
    }

    const albumPath = path.dirname(filePath); // e.g., "album1"
    const baseName = path.parse(fileName).name; // e.g., "video1"
    const thumbnailName = `${baseName}-thumbnail.jpg`; // e.g., "video1-thumbnail.jpg"
    const thumbnailPath = path.join(os.tmpdir(), thumbnailName);
    const thumbnailStoragePath = `${albumPath}/thumbnails/${thumbnailName}`; // e.g., "album1/thumbnails/video1-thumbnail.jpg"

    const tempFilePath = path.join(os.tmpdir(), fileName);
    const bucket = storage.bucket(fileBucket);

    await bucket.file(filePath).download({ destination: tempFilePath });

    await new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .screenshots({
          count: 1,
          folder: os.tmpdir(),
          filename: thumbnailName,
          size: "320x240",
        })
        .on("end", resolve)
        .on("error", reject);
    });

    await bucket.upload(thumbnailPath, {
      destination: thumbnailStoragePath,
    });

    console.log(`Thumbnail uploaded to ${thumbnailStoragePath}`);

    await fs.unlink(tempFilePath); // Deletes the downloaded video
    await fs.unlink(thumbnailPath); // Deletes the generated thumbnail

    return null;
  });
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

admin.initializeApp();
ffmpeg.setFfmpegPath(ffmpegPath.path);
const bucket = admin.storage().bucket();

export const generateVideoThumbnail = functions.storage
  .object()
  .onFinalize(async (object) => {
    const filePath = object.name || "";
    const contentType = object.contentType || "";

    // Only process video files
    if (!contentType.startsWith("video/")) {
      console.log("Not a video file. Exiting...");
      return null;
    }

    const fileName = path.basename(filePath);
    const tempLocalFile = path.join(os.tmpdir(), fileName);
    const tempThumbnailFile = path.join(
      os.tmpdir(),
      `${fileName}-thumbnail.jpg`
    );
    const thumbnailPath = `${path.dirname(filePath)}/thumbnails/${fileName}-thumbnail.jpg`;

    try {
      // Download video to a temporary location
      await bucket.file(filePath).download({ destination: tempLocalFile });
      console.log(`Downloaded video: ${filePath}`);

      // Generate thumbnail using FFmpeg
      await new Promise((resolve, reject) => {
        ffmpeg(tempLocalFile)
          .screenshots({
            count: 1,
            folder: os.tmpdir(),
            filename: `${fileName}-thumbnail.jpg`,
          })
          .on("end", resolve)
          .on("error", reject);
      });
      console.log("Thumbnail generated.");

      // Upload thumbnail to Firebase Storage
      await bucket.upload(tempThumbnailFile, {
        destination: thumbnailPath,
        metadata: { contentType: "image/jpeg" },
      });
      console.log(`Uploaded thumbnail to: ${thumbnailPath}`);
    } catch (error) {
      console.error("Error generating thumbnail:", error);
    } finally {
      // Clean up temporary files
      fs.unlinkSync(tempLocalFile);
      fs.unlinkSync(tempThumbnailFile);
    }

    return null;
  });
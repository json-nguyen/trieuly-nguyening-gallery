import React, { useState, useEffect } from "react";
import AlbumBox from "../components/Gallery/AlbumBox";
import { albums } from "./testData"
import Gallery from 'react-photo-gallery';
import FileUploader from "../components/shared/FileUploader";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../services/firebase";

const GalleryPage = () => {
	const [selectedAlbum, setSelectedAlbum] = useState(albums[0])
	const [photos, setPhotos] = useState([]); // Updated state to store photo URLs
  const [loading, setLoading] = useState(false)

	useEffect(() => {
		if(selectedAlbum) {
			fetchPhotos()
		}
	}, [selectedAlbum])

	const fetchPhotos = async () => {
    setLoading(true);
    const albumRef = ref(storage, selectedAlbum.title); // Album folder reference
    try {
      const result = await listAll(albumRef);
      const urls = await Promise.all(
        result.items.map((item) => getDownloadURL(item))
      );

      const formattedPhotos = urls.map((url) => ({
        src: url,
        width: 4, 
        height: 3,
      }));
      setPhotos(formattedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

	return (
		<div className="bg-gray-100 min-h-screen p-4 flex flex-col">	
		{/* Album Scroll Container */}
			<div className="flex overflow-x-auto space-x-4 w-full py-4 items-center">
				{albums.map((album) => (
					<AlbumBox
						title={album.title}
						key={album.id}
						coverPath={album.cover}
						handleClick={() => setSelectedAlbum(album)}
						selected={album.id === selectedAlbum.id}
					/>
				))}
			</div>
			<div className="mb-2 items-center">
				<FileUploader folderName={selectedAlbum.title} />
			</div>
			<div>
				<Gallery
					photos={photos}
					columns={(containerWidth) => {
						if (containerWidth >= 900) return 4; // 4 columns for large screens
						if (containerWidth >= 600) return 3; // 3 columns for medium screens
						return 2; // 2 columns for small screens
					}}
				/>
			</div>
		</div>
	);  
}

export default GalleryPage;
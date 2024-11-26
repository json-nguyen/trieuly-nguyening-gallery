import React, { useState, useEffect, useCallback } from "react";
import AlbumBox from "../components/Gallery/AlbumBox";
import { albums } from "./testData"
import Gallery from 'react-photo-gallery';
import FileUploader from "../components/shared/FileUploader";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../services/firebase";
import Carousel, { Modal, ModalGateway } from "react-images";

const GalleryPage = () => {
	const [selectedAlbum, setSelectedAlbum] = useState(albums[0])
	const [photos, setPhotos] = useState([]); // Updated state to store photo URLs
  const [loading, setLoading] = useState(false)
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

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
     
			const formattedPhotos = await Promise.all(
				result.items.map(async (item) => {
					const url = await getDownloadURL(item); // Get the download URL for the image
					
					// Create an Image object to load the image
					const img = new Image();
					img.src = url;
	
					// Return a promise that resolves when the image is loaded and its dimensions are available
					return new Promise((resolve) => {
						img.onload = () => {
							resolve({
								src: url,
								width: img.width,   // Actual width of the image
								height: img.height, // Actual height of the image
							});
						};
					});
				})
			);
     
      setPhotos(formattedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

	const openLightbox = useCallback((event, { photo, index }) => {
		console.log('OPENING', index)
    setCurrentImage(index);
    setViewerOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerOpen(false);
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
						if (photos.length === 1) return 1; // 1 column for one photo
            if (containerWidth >= 900) return 4; // 4 columns for large screens
            if (containerWidth >= 600) return 3; // 3 columns for medium screens
            return 2; // 2 columns for small screens
					}}
					onClick={openLightbox}
				/>
				 <ModalGateway>
					{viewerOpen ? (
						<Modal onClose={closeLightbox}>
							<Carousel
								currentIndex={currentImage}
								views={photos.map(x => ({
									...x,
									srcset: x.srcSet,
									caption: x.title
								}))}
							/>
						</Modal>
					) : null}
				</ModalGateway>
			</div>
		</div>
	);  
}

export default GalleryPage;
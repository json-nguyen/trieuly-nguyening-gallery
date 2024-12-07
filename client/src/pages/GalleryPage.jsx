import React, { useState, useEffect, useCallback } from "react";
import AlbumBox from "../components/Gallery/AlbumBox";
import { albums } from "../constants/albums"
import Gallery from 'react-photo-gallery';
import FileUploader from "../components/shared/FileUploader";
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { storage } from "../services/firebase";
import ContentCarousel from "../components/Gallery/ContentCarousel";
import JBLoader from "../components/shared/JBLoader";
import InfiniteScroll from "react-infinite-scroll-component";

const PHOTOS_PER_PAGE = 20

const GalleryPage = () => {
	const [selectedAlbum, setSelectedAlbum] = useState(albums[0])
	const [photos, setPhotos] = useState([]); 
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false); 
  const [currentPage, setCurrentPage] = useState(0); 

	useEffect(() => {
		if(selectedAlbum) {
			resetGallery()
			fetchPhotos(0, true)
		}
	}, [selectedAlbum])

	const resetGallery = () => {
    setPhotos([]); // Clear existing photos
    setCurrentPage(0); // Reset to the first page
    setAllLoaded(false); // Enable loading more photos
  };

	const fetchPhotos = async (page, resetPhotos) => {
		if ((loading || allLoaded) && !resetPhotos) return;
		setLoading(true)
    const albumRef = ref(storage, selectedAlbum.title); 
    try {
      const result = await listAll(albumRef);
			const startIndex = page * PHOTOS_PER_PAGE; 
      const items = result.items.slice(startIndex, startIndex + PHOTOS_PER_PAGE); 
			if (items.length === 0) {
        setAllLoaded(true); 
        return;
      }
			const formattedPhotos = await Promise.all(
				items.map(async (item) => {
					const url = await getDownloadURL(item); 
					const metadata = await getMetadata(item);
					const contentType = metadata.contentType;
					const isVideo = contentType && contentType.startsWith("video/");

					let imageUrl = url
					if(isVideo) {
						const thumbnailPath = `${selectedAlbum.title}/thumbnails/${item.name.split('.')[0]}-thumbnail.jpg`;
						imageUrl = await getDownloadURL(ref(storage, thumbnailPath))
					}

					const img = new Image();
					img.src = imageUrl

					return new Promise((resolve) => {
						img.onload = () => {
							resolve({
								src: imageUrl,
								width: img.width,   // Actual width of the image
								height: img.height, // Actual height of the image
								type: isVideo ? 'video' : 'image',
								originalUrl: url,
								title: item.name
							});
						};
					});
				})
			);
     
			setPhotos((prev) => [...prev, ...formattedPhotos]); // Add new photos to the list
      setCurrentPage((prev) => prev + 1); 
			
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

	const handleLoadMore = () => {
		fetchPhotos(currentPage, false); // Load the next page
	};
	
  const openModal = useCallback((event, { index }) => {
    setCurrentImage(index);
    setModalOpen(true);
  }, []);

	const closeModal = () => {
    setModalOpen(false);
  };


	return (
		<div className="bg-gray-100 min-h-screen p-4 flex flex-col">	
			<InfiniteScroll
        dataLength={photos.length} // Current photos count
        next={handleLoadMore} // Function to fetch more photos
        hasMore={!allLoaded} // Check if more photos are available
        loader={
					<div className="flex justify-center items-center">
						<JBLoader />
					</div>
				} // Loading indicator
        endMessage={<p style={{ textAlign: "center" }}>You have seen it all!</p>} // End message
      >
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
				<Gallery
					photos={photos}
					columns={(containerWidth) => {
						if (photos.length === 1) return 1; // 1 column for one photo
						if (containerWidth >= 900) return 4; // 4 columns for large screens
						if (containerWidth >= 600) return 3; // 3 columns for medium screens
						return 2; // 2 columns for small screens
					}}
					onClick={openModal}
				/>			
			</InfiniteScroll>	
			<ContentCarousel
				data={photos}
				open={modalOpen}
				onClose={closeModal}
				currentIndex={currentImage}
				setCurrentIndex={setCurrentImage}
			/>
		</div>
	);  
}

export default GalleryPage;
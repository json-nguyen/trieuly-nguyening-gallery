import React, { useState, useEffect, useCallback, useRef  } from "react";
import AlbumBox from "../components/Gallery/AlbumBox";
import { albums } from "../constants/albums"
import FileUploader from "../components/shared/FileUploader";
import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import { storage } from "../services/firebase";
import ContentCarousel from "../components/Gallery/ContentCarousel";
import JBLoader from "../components/shared/JBLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import "./styles/GalleryPage.css"
import { PlayCircleIcon } from "@heroicons/react/24/outline";
const PHOTOS_PER_PAGE = 24

const GalleryPage = () => {
	const [selectedAlbum, setSelectedAlbum] = useState(albums[0])
	const [photos, setPhotos] = useState([]); 
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false); 
  const [currentPage, setCurrentPage] = useState(0); 
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

	useEffect(() => {
		if(selectedAlbum) {
			resetGallery()
			fetchPhotos(0, true)
		}
	}, [selectedAlbum])

	useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

			const sortedItems = result.items.sort((a, b) => b.name.localeCompare(a.name));

			const startIndex = page * PHOTOS_PER_PAGE; 
      const items = sortedItems.slice(startIndex, startIndex + PHOTOS_PER_PAGE); 
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
	
  const openModal = useCallback((index) => {
    setCurrentImage(index);
    setModalOpen(true);
  }, []);

	const closeModal = () => {
    setModalOpen(false);
  };

  const getColumns = () => {
    if (containerWidth >= 900) return 5;
    if (containerWidth >= 600) return 4;
    return 3;
  };

	const handleFileUpload = (uploadedFile) => {
    setPhotos((prevPhotos) => [uploadedFile, ...prevPhotos]);
  };

	return (
		<div className="bg-gray-100 min-h-screen p-4 flex flex-col" ref={containerRef} >	
			<InfiniteScroll
        dataLength={photos.length} 
        next={handleLoadMore}
        hasMore={!allLoaded}
        loader={
					<div className="flex justify-center items-center">
						<JBLoader />
					</div>
				} 
        endMessage={<p style={{ textAlign: "center" }}>You have seen it all!</p>} 
      >
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
				{}
				<div className="mb-2 items-center">
					<FileUploader 
						folderName={selectedAlbum.title} 
						onFileUpload={handleFileUpload}
					/>
				</div>
				  {	loading && photos.length === 0 ? ( 
					<div className="flex justify-center items-center flex-grow">
						<JBLoader />
					</div> 
					) : (
						// PHOTO GLALERY HERE 
					<div className="photo-grid" style={{ gridTemplateColumns: `repeat(${getColumns()}, 1fr)` }}>
						{photos.map((photo, index) => (
							<div key={index} className="photo-item" onClick={() => openModal(index)}>
								<div className="relative">
									<img src={photo.src} alt={photo.title} className="w-full h-auto" />
									{photo.type === "video" && (
										<PlayCircleIcon className="absolute top-1 right-1 w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 text-white" />
									)}
								</div>
							</div>
						))}
					</div>
				)}
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
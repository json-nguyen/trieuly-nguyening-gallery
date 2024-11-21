import React, { useState } from "react";
import AlbumBox from "../components/Gallery/AlbumBox";
import {photos, albums} from "./testData"
import Gallery from 'react-photo-gallery';
import StyledButton from "../components/shared/StyledButton";
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import FileUploader from "../components/shared/FileUploader";

const GalleryPage = () => {
	const [selectedAlbum, setSelectedAlbum] = useState(albums[0])

  
	return (
		<div className="bg-gray-100 min-h-screen p-4 flex flex-col">	
		{/* Album Scroll Container */}
			<div className="flex overflow-x-auto space-x-4 w-full py-4 items-center">
				{albums.map((album) => (
					<AlbumBox
						title={album.title}
						key={album.id}
						coverPath={album.cover}
						handleClick={() => setSelectedAlbum(album.id)}
						selected={album.id === selectedAlbum.id}
					/>
				))}
			</div>
			<div className="mb-2 items-center">
				<FileUploader />
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
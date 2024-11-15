import React, { useState } from "react";
import AlbumBox from "../components/Gallery/AlbumBox";
import {photos, albums} from "./testData"
import Gallery from 'react-photo-gallery';

const GalleryPage = () => {
	const [selectedAlbum, setSelectedAlbum] = useState(1)

  
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
						selected={album.id === selectedAlbum}
					/>
				))}
			</div>
			<div>
			<Gallery
        photos={photos}
        columns={(containerWidth) => {
					console.log("Container width:", containerWidth);

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
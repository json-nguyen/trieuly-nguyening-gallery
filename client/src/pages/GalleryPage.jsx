import React, { useState } from "react";

const GalleryPage = () => {
	const [selectedAlbum, setSelectedAlbum] = useState(1)

  const albums = [
		{ id: 1, title: 'WELCOME PARTY', cover: 'path/to/cover1.jpg' },
		{ id: 2, title: 'MORNING OF', cover: 'path/to/cover2.jpg' },
		{ id: 3, title: 'CEREMONY', cover: 'path/to/cover3.jpg' },
		{ id: 4, title: 'COCKTAIL HOUR', cover: 'path/to/cover4.jpg' },
		{ id: 5, title: 'RECEPTION', cover: 'path/to/cover5.jpg' },
	];
      
	return (
		<div className="bg-gray-100 min-h-screen p-4 flex flex-col items-center">	
		{/* Album Scroll Container */}
			<div className="flex overflow-x-auto space-x-4 w-full py-4">
				{albums.map((album) => (
				 <div
						onClick={() => setSelectedAlbum(album.id)}
						key={album.id}
						className={`flex-shrink-0 w-36 h-36 sm:w-48 sm:h-48 rounded-sm overflow-hidden shadow-lg bg-white relative
													transform transition duration-200 ease-in-out hover:scale-105 active:scale-95`}
					>
					{/* Album Cover */}
					<img
						src={album.cover}
						alt={`${album.title} Cover`}
						className="object-cover w-full h-full"
					/>
		
					{/* Album Title */}
					<div 
						className={
							`font-quincy absolute bottom-0 left-0 w-full bg-opacity-60 text-black text-center py-1 
							${album.id === selectedAlbum ? 'bg-clicked-purple' : 'bg-light-purple'}`}
					>
						{album.title}
					</div>
				</div>
				))}
			</div>
		</div>
	);  
}

export default GalleryPage;
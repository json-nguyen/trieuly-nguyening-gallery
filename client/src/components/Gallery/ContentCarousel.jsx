import React, { useState } from "react";
import { Carousel } from 'react-responsive-carousel'
import { Modal } from 'react-responsive-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import 'react-responsive-modal/styles.css';
import './ContentCarousel.css'
import { XMarkIcon, ArrowDownTrayIcon} from '@heroicons/react/24/outline';

const ContentCarousel = ({data, open, onClose, currentIndex, setCurrentIndex}) => {
  const currentItem = data[currentIndex]; // Get the current item

  const downloadFile = async () => {
    if (!currentItem) return;
  
    const url = currentItem.type === 'video' ? currentItem.originalUrl : currentItem.src;
  
    try {
      // Fetch the file as a blob
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch the file');
      }
  
      const blob = await response.blob();
  
      // Create a temporary link to trigger the download
      const tempLink = document.createElement('a');
      tempLink.href = URL.createObjectURL(blob);
      tempLink.download = currentItem.title || 'downloaded-file'; // Set file name
      tempLink.style.display = 'none';
  
      // Append link to the DOM, trigger the click, and remove the link
      document.body.appendChild(tempLink);
      tempLink.click();
  
      // Clean up
      URL.revokeObjectURL(tempLink.href);
      document.body.removeChild(tempLink);
    } catch (error) {
      console.error('Failed to download the file:', error);
    }
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      center
      showCloseIcon={false} 
      classNames={{
        overlay: 'modal-overlay',
        modal: 'modal-content',
      }}
    >
      <div className="icon-container flex">
        <ArrowDownTrayIcon onClick={downloadFile} className="mr-3 h-8 w-8 text-white" />
        <XMarkIcon onClick={onClose} className="h-8 w-8 text-white" />
      </div>
      <Carousel
        selectedItem={currentIndex}
        onChange={(index) => setCurrentIndex(index)}
        showThumbs={false}
        dynamicHeight={true}
      >
        {data.map((item, index) => (
          <div key={index}>
            {item.type === 'video' ? (
              <video controls style={{ width: '100%', height: 'auto' }}>
                <source src={item.originalUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={item.src} alt={item.title} style={{ width: '100%', height: 'auto' }} />
            )}
          </div>
        ))}
      </Carousel>
    </Modal>
  )
}

export default ContentCarousel
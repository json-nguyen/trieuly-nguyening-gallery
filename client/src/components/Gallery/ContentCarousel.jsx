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
    const isShareSupported = navigator.canShare && navigator.canShare({ files: [new File([], '')] });

    try {
      // Fetch the file as a Blob
      const url = currentItem.type === 'video' ? currentItem.originalUrl: currentItem.src
      if (isShareSupported) {
        // Web Share API for supported browsers (iOS and modern browsers)
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], currentItem.title, { type: blob.type });

        await navigator.share({
          files: [file],
          title: 'Download or Share',
          text: `Check out this ${currentItem.type}`
        });
      } else {
        // Fallback to traditional download method for unsupported browsers
        const response = await fetch(url);
        const blob = await response.blob();

        // Create a temporary link to trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = currentItem.title; // Set the desired filename
        link.click(); // Trigger the download
      }
    } catch (error) {
      console.error('Download failed', error);
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
import React, { useState } from "react";
import { Carousel } from 'react-responsive-carousel'
import { Modal } from 'react-responsive-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import 'react-responsive-modal/styles.css';
import './ContentCarousel.css'

const ContentCarousel = ({data, open, onClose, currentIndex, setCurrentIndex}) => {
  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      center
      showCloseIcon={false} 
      classNames={{
        overlay: 'custom-modal-overlay',
        modal: 'custom-modal-content',
      }}
    >
     
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
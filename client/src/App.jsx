import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GalleryPage from './pages/GalleryPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<GalleryPage />} /> 
        {/* <Route path="/upload" element={<UploadPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/upload" element={<UploadPage />} />
        <Route path="/gallery" element={<GalleryPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
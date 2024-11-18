import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GalleryPage from './pages/GalleryPage';
import JBToast from './components/shared/JBToast/JBToast'
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<GalleryPage />} /> 
        {/* <Route path="/upload" element={<UploadPage />} /> */}
      </Routes>
      <JBToast/>
    </div>
  );
}

export default App;
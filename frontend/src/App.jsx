import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import BrowsePage from "./pages/BrowsePage";
import UploadPage from "./pages/UploadPage";
import MyResourcesPage from "./pages/MyResourcesPage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<BrowsePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/my-resources" element={<MyResourcesPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

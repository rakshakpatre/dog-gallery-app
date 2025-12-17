import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import BreedDetail from "./pages/BreedDetail";
import LikedImages from "./pages/LikedImages";
import Navbar from "./components/Navbar";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDarkMode(saved === "dark");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breed/:name" element={<BreedDetail />} />
        <Route path="/likes" element={<LikedImages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

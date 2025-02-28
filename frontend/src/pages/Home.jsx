import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHomeConfig } from "../services/api";

const Home = () => {
  const [isDark, setIsDark] = useState(false);
  const [mainText, setMainText] = useState("Welcome to the Church Life");
  const [bgLight, setBgLight] = useState("/bg.png");
  const [bgDark, setBgDark] = useState("/dark.jpg");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getHomeConfig();
        setMainText(data.mainText || "Welcome to the Church Life");
        if (data.lightBg) setBgLight(data.lightBg);
        if (data.darkBg) setBgDark(data.darkBg);
        if (data.bannerTitle) setBannerTitle(data.bannerTitle);
        if (data.banner) setBannerImage(data.banner);
        if (data.sections && Array.isArray(data.sections)) {
          setSections(data.sections);
        }
      } catch (error) {
        console.error("Error fetching home configuration:", error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      {/* Hero Section with dynamic background */}
      <div
        className="bg-cover bg-center w-full h-screen transition-all duration-500"
        style={{ backgroundImage: `url(${isDark ? bgDark : bgLight})` }}
      >
        <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-40">
          {/* Main Welcome Text */}
          <h1 className="lg:text-7xl md:text-4xl text-center font-bold text-gray-100 px-4">
            {mainText}
          </h1>
          <div className="mt-10">
            <Link to="/library" className="btn btn-primary btn-md text-white">
              Library Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

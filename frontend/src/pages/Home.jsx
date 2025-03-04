import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getHomeConfig } from "../services/api";
import { AuthContext } from "../Contexts/AuthContext";
import Marquee from "react-fast-marquee";

const Home = () => {
  const { user } = useContext(AuthContext);

  const [isDark, setIsDark] = useState(false);
  const [mainText, setMainText] = useState("Welcome to the Church Life");
  const [bgLight, setBgLight] = useState("/bg.png");
  const [bgDark, setBgDark] = useState("/dark.jpg");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [sections, setSections] = useState([]);
  // Latest updates for the marquee (can be fetched from API as well)
  const [latestUpdates, setLatestUpdates] = useState([
    "New sermon uploaded!",
    "Weekly newsletter released!",
    "Upcoming event: Community Picnic",
  ]);

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
        if (data.latestUpdates && Array.isArray(data.latestUpdates)) {
          setLatestUpdates(data.latestUpdates);
        }
      } catch (error) {
        console.error("Error fetching home configuration:", error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      {/* Conditionally render the marquee only if user is logged in */}
      {user && (
        <div className="w-full bg-red-700 font-semibold text-white  overflow-hidden">
          <Marquee pauseOnHover={true} gradient={true} gradientColor={"yellow"}>
            {latestUpdates.map((update, index) => (
              <span key={index} className="mx-4 inline-block text-xl">
                {update}
              </span>
            ))}
          </Marquee>
        </div>
      )}

      {/* Hero Section with dynamic background and fade-in animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-cover bg-center w-full h-screen transition-all duration-500"
        style={{ backgroundImage: `url(${isDark ? bgDark : bgLight})` }}
      >
        <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-50">
          <h1 className="lg:text-7xl md:text-5xl text-3xl font-bold text-center text-white px-4">
            {mainText}
          </h1>
          <div className="mt-10">
            <Link to="/library" className="btn btn-primary btn-md text-white">
              Library Books
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Footer from "@/components/Footer";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModulesPage() {
  const [checkUser, setCheckUser] = useState([])
  const [modules, setModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelOpen, setLevelOpen] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchModulesAndUser() {
      setLoading(true);
      try {
        const modulesRes = await fetch(`${API_URL}/api/module/allModule-storage`);
        const modulesData = await modulesRes.json();

        if (modulesData.listall) {
          const updatedModules = modulesData.listall.map((module) => ({
            ...module,
            file_url: module.file_data ? `data:${module.file_mime_type};base64,${module.file_data}` : null,
          }));

          setModules(updatedModules);
        } else {
          setModules([]);
        }

        const userRes = await fetch(`${API_URL}/api/user/profile`, {
          method: "GET",
          credentials: "include",
        });
        const userData = await userRes.json();
        setCheckUser(userData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }

    fetchModulesAndUser();
  }, []);

  const uniqueTags = [...new Set(modules.flatMap((module) => module.tags))];

  const handleTagChange = (tag) => {
    setSelectedTags((prevTags) => {
      const newTags = new Set(prevTags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const filteredModules = modules.filter((module) => {
    const nameMatch = module?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const levelMatch = (module?.difficulty_level?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const tagMatch = module?.tags?.some(tag => (tag?.toLowerCase() || "").includes(searchQuery.toLowerCase()));

    const selectedTagMatch = selectedTags.size === 0 || module?.tags?.some(tag => selectedTags.has(tag));
    const selectedLevelMatch = selectedLevel === "" || (module?.difficulty_level?.toLowerCase() || "") === selectedLevel?.toLowerCase();

    return (nameMatch || levelMatch || tagMatch) && selectedTagMatch && selectedLevelMatch;
  });

  const loadMoreModules = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    if (visibleCount >= filteredModules.length) {
      setHasMore(false);
      return;
    }

    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prevCount) => {
        const newCount = prevCount + 6;
        if (newCount >= filteredModules.length) {
          setHasMore(false);
        }
        return newCount;
      });
      setIsLoadingMore(false);
    }, 1000);
  }, [isLoadingMore, hasMore, visibleCount, filteredModules.length]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop < 
      document.documentElement.offsetHeight - 100 ||
      isLoadingMore ||
      !hasMore
    ) {
      return;
    }
    
    loadMoreModules();
  }, [isLoadingMore, hasMore, loadMoreModules]);

  useEffect(() => {
    setHasMore(true);
    setVisibleCount(6);
  }, [searchQuery, selectedLevel, selectedTags, modules]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? uniqueTags : uniqueTags.slice(0, 5);


  const visibleModules = filteredModules.slice(0, visibleCount);

  return (
    <div className="h-screen mt-14 ">
      <MaxWidthWrapper >
        <section className="flex md:flex-row flex-col justify-center lg:mx-20 py-8 gap-6 ">

          <div className="lg:block hidden h-[70vh] lg:w-1/3 sticky top-20">
            <div className="flex flex-row items-center gap-3 text-3xl mb-4 pb-4 border-b">
              <DashboardOutlinedIcon />
              <h2 className="">Modules</h2>
            </div>
            <section className=" w-full flex flex-row px-4 py-3 mb-4 justify-between items-center border rounded-lg ">
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none"
              />
              <SearchOutlinedIcon />
            </section>

            <section className=" relative pb-4 ">
              <button
                onClick={() => setLevelOpen(!levelOpen)}
                className="w-full lg:h-11 h-9  py-2 px-4 text-left bg-white border  rounded-lg flex items-center justify-between"
              >
                {selectedLevel || "All Level"}
                <span className="ml-2 text-gray-500"><ExpandMoreIcon /></span>
              </button>
              {levelOpen && (
                <ul className="absolute top-14 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  <li
                    onClick={() => {
                      setSelectedLevel("");
                      setLevelOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    All Levels
                  </li>
                  {["Easy", "Medium", "Hard"].map((level, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedLevel(level);
                        setLevelOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {level}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="mb-4 px-4">
              <p className="font-semibold mb-2">Filter by Tags:</p>
              <div className="h-[50vh] flex flex-col items-start gap-3 overflow-y-auto">
                {visibleTags.map((tag, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTags.has(tag)}
                      onChange={() => handleTagChange(tag)}
                      className="w-4 h-4"
                    />
                    <span className="text-base first-letter:uppercase  text-gray-500">{tag}</span>
                  </label>
                ))}
                {uniqueTags.length > 5 && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="text-red-500 text-sm font-medium"
                  >
                    {showAllTags ? "See Less" : "See More"}
                  </button>
                )}
              </div>
            </section>
          </div>

          <div className="w-full flex flex-wrap md:gap-4 gap-y-4 md:justify-start justify-between items-center">
            <section className="lg:h-20 h-fit w-full py-2 flex lg:flex-row flex-col justify-between items-center  gap-6 text-xs border-b-[1px] bg-white">
              <div>
                <p className="text-xl font-medium mb-4">🌟 Stay Inspired & Keep Learning! 🌟</p>
                <p className="">💡Every expert was once a beginner. Web3 is
                  still evolving, and you have the chance to grow with it. Keep learning, keep building!</p>
              </div>
              <div className="lg:hidden w-full flex flex-row justify-between gap-2">
                <div className=" w-full h-12 flex flex-row items-center border rounded-lg overflow-hidden bg-slate-100">
                  <input
                    placeholder="Search Module"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full py-2 pl-4 outline-none bg-slate-100"
                  />
                  <SearchOutlinedIcon className="mr-2" />
                </div>
                <section className=" relative pb-4 ">
                  <button
                    onClick={() => setLevelOpen(!levelOpen)}
                    className="w-full h-12  py-2 px-4 text-left bg-white border  rounded-lg flex items-center justify-between"
                  >
                    {selectedLevel || "All Level"}
                    <span className="ml-2 text-gray-500"><ExpandMoreIcon /></span>
                  </button>
                  {levelOpen && (
                    <ul className="absolute top-14 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                      <li
                        onClick={() => {
                          setSelectedLevel("");
                          setLevelOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        All Levels
                      </li>
                      {["Easy", "Medium", "Hard"].map((level, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setSelectedLevel(level);
                            setLevelOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {level}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </section>
            {loading ? (
              <div className="w-full flex justify-center items-center">
                <div className="animate-spin h-16 w-16 border-4 border-red-500 border-t-transparent rounded-full"></div>
              </div>
            ) : visibleModules.length > 0 ? (
              <>
                {visibleModules.map((module, index) => (
                  <Link
                    to={`units/${module.id}`}
                    key={index}
                    className="md:h-[24rem] h-[16rem]  flex flex-col justify-between xl:w-[19rem] sm:w-72  w-40  border border-b-2 border-b-red-800 rounded-xl bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-[1px_0px_20px_2px_rgba(0,_0,_0,_0.1)]"
                  >
                    <div
                      className={`relative flex w-full md:min-h-56 h-80 p-2 overflow-hidden rounded-xl text-white transition-all duration-300  "
                        }`}
                    >
                      {module.file_url && (
                        <img
                          className=" w-full h-full aspect-[20/13] object-cover overflow-hidden rounded-md z-10 transition-transform duration-300 group-hover:scale-105 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                          src={module.file_url}
                          alt={module.name}
                        />
                      )}
                      {module.file_url && (
                        <p
                          className={`md:text-sm text-xs absolute right-3 top-3 text-white px-3 py-1 rounded z-10 capitalize  ${module?.difficulty_level === 'easy'
                            ? 'bg-green-600'
                            : module?.difficulty_level === 'medium'
                              ? 'bg-yellow-500'
                              : module?.difficulty_level === 'hard'
                              && 'bg-red-600'
                            }`}
                        >
                          {module?.difficulty_level}
                        </p>

                      )}
                      {!module.file_url && (
                        <img
                          className={`w-full h-full aspect-[20/13] object-cover overflow-hidden rounded-md z-10 transition-transform duration-300 group-hover:scale-105 ${!module.file_url && "bg-red-950 "}shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                          src="/IMG_Modules/LOGO_white.png"
                          alt={module.name}
                        />
                      )}
                    </div>
                    <div className="h-full p-2 px-3">
                      <img className="md:h-4 md:w-20 h-3 w-18 mb-2" src="/IMG_Modules/LOGO_maroon.png" alt="" />
                      <h2 className="md:h-12 overflow-hidden leading-snug md:font-bold break-words line-clamp-2 z-10 text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {module.name}
                      </h2>
                      <div className=" w-full md:h-14 h-6 flex flex-row flex-wrap  gap-1 overflow-hidden my-2">
                        {module.tags.map((tag, index) => (
                          <p
                            key={index}
                            className="h-fit border px-2 py-1 rounded-lg md:text-[0.6rem] text-[0.45rem] tracking-wide transition-all duration-300 hover:bg-gray-200"
                          >
                            {tag}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
                {isLoadingMore && (
                  <div className="w-full flex justify-center items-center">
                    <div className="animate-spin h-16 w-16 border-4 border-red-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </>
            ) : (
              <p>No modules available</p>
            )}
          </div>
        </section>
      </MaxWidthWrapper>
      <Footer />
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Footer from "@/components/Footer";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());

  useEffect(() => {
    async function fetchModulesAndUser() {
      try {

        const modulesRes = await fetch("http://localhost:5000/api/module/allModule-storage");
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

        const userRes = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          credentials: "include",
        });
        const userData = await userRes.json();
        setCheckUser(userData);


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchModulesAndUser();
  }, []);

  const uniqueTags = [...new Set(modules.flatMap((module) => module.tags))];

  // Handle checkbox selection
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

  // Filter modules based on searchQuery and selectedTags
  const filteredModules = modules.filter((module) =>
    (module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (selectedTags.size === 0 || module.tags.some(tag => selectedTags.has(tag))) // Filter by selected tags
  );

  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? uniqueTags : uniqueTags.slice(0, 5);

  return (
    <div className="h-screen mt-14 ">
      <MaxWidthWrapper >
        <section className="flex md:flex-row flex-col justify-center lg:mx-20 py-8 gap-6 ">

          {/* Search Filter section */}
          <div className="lg:block hidden h-[70vh] lg:w-1/3 sticky top-20">
            <div className="flex flex-row items-center gap-3 text-3xl mb-4 pb-4 border-b">
              <DashboardOutlinedIcon />
              <h2 className="">Modules</h2>
            </div>
            <section className=" w-full flex flex-row px-4 py-3 mb-4 justify-between items-center border-[1px] rounded-lg ">
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full   outline-none"
              />
              <SearchOutlinedIcon />
            </section>

            {/* Filter section */}
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
                    className="text-blue-500 text-sm font-medium"
                  >
                    {showAllTags ? "See Less" : "See More"}
                  </button>
                )}
              </div>
            </section>
          </div>

          <div className="w-full flex flex-wrap gap-4 md:justify-start justify-evenly">
            {/* Search */}
            <section className="lg:h-20 h-fit w-full py-2 flex lg:flex-row flex-col justify-between items-center  gap-6 text-xs border-b-[1px] bg-white">
              <div>
                <p className="text-xl font-medium mb-4">🌟 Stay Inspired & Keep Learning! 🌟</p>
                <p className="">💡Every expert was once a beginner. Web3 is
                   still evolving, and you have the chance to grow with it. Keep learning, keep building!</p>
              </div>
              <div className="lg:hidden w-full flex flex-row items-center border-[1px] rounded-lg overflow-hidden bg-slate-100">
                <input
                  placeholder="Search Module"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full py-2 pl-4 outline-none bg-slate-100"
                />
                <SearchOutlinedIcon className="mr-2" />
              </div>
            </section>
            {/* Display filtered modules */}
            {filteredModules && filteredModules.length > 0 ? (
              filteredModules.map((module, index) => (
                <section
                  key={index}
                  className="h-[23rem] flex flex-col justify-between xl:w-[19rem] md:w-52 sm:w-80 w-56 rounded-md border-[1px] bg-white overflow-hidden"
                >
                  <div className={`relative flex w-full min-h-36 p-3 text-white ${!module.file_url && "bg-red-900"}`}>
                    {module.file_url && (
                      <img
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        src={module.file_url}
                        alt={module.name}
                      />
                    )}
                    {module.file_url && <div className="absolute inset-0 bg-black bg-opacity-75 z-10"></div>}
                    <h2 className="text-lg font-medium line-clamp-3 z-10">
                      {module.name}
                    </h2>
                  </div>
                  <div className="h-full p-3">
                  <img className="h-4 w-20 mb-2"
                  src="/IMG_Modules/LOGO_maroon.png" alt="" />
                  <div className="w-full h-14 flex flex-row flex-wrap gap-1 overflow-hidden my-2">
                    {module.tags.map((tag, index) => (
                      <p
                        key={index}
                        className="h-fit border-2 px-2 py-1 rounded-lg lg:text-[0.6rem] text-[0.45rem] tracking-wide"
                      >
                        {tag}
                      </p>
                    ))}
                  </div>
                    <p className="text-sm line-clamp-3">{module.description}</p>
                    </div>
                  <section className="w-full h-12 p-3 mb-3 flex justify-end items-center text-xs">
                    <div className="group">
                      <Link
                        to={`units/${module.id}`}
                        className="rounded-sm py-2 px-4 font-medium bg-[#333333] hover:bg-[#121212] text-white"
                      >
                        Start
                      </Link>
                    </div>
                  </section>
                </section>
              ))
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

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { games } from "../games/Games";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Footer from "@/components/Footer";
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"




export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [findModules, setFindModules] = useState([])
  const [checkUser, setCheckUser] = useState(null);
  const [moduleScores, setModuleScores] = useState([])
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchModulesAndUser() {
      try {

        const modulesRes = await fetch("http://localhost:5000/api/module/allModule-storage");
        const modulesData = await modulesRes.json();

        if (Array.isArray(modulesData.listall)) {
          setModules(modulesData.listall);
        } else {
          setModules([]);
        }


        const Find_modulesRes = await fetch("http://localhost:5000/api/module/allModule");
        const Find_modulesData = await Find_modulesRes.json();

        if (Array.isArray(Find_modulesData.listall)) {
          setFindModules(Find_modulesData.listall);
        } else {
          setFindModules([]);
        }

        // Fetch user profile
        const userRes = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          credentials: "include",
        });
        const userData = await userRes.json();
        setCheckUser(userData);

        // Fetch user scores
        if (userData?.id) {
          const userScoreRes = await fetch(`http://localhost:5000/api/module/get-user-score/${userData.id}`);
          if (userScoreRes.ok) {
            const userScoresData = await userScoreRes.json();
            if (Array.isArray(userScoresData)) {
              setModuleScores(userScoresData);
            } else {
              console.error("No user scores found");
              setModuleScores([]);
            }
          } else {
            console.error("Failed to fetch user scores");
            setModuleScores([]);
          }
        } else {
          console.error("User ID is missing");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchModulesAndUser();
  }, []);

  const filteredModules = modules.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <div className="h-screen mt-14 ">
      {/* Carousel for games */}
      <MaxWidthWrapper className="w-full flex justify-center border-b-[1px] shadow bg-[#202020]">
        <Carousel
          plugins={[plugin.current]}
          className="lg:w-[95%] w-full"

        >
          <CarouselContent>
            {Array.from(games).map((game, index) => (
              <CarouselItem key={index} className="w-full">
                <Card className="border-none shadow-none rounded-none ">
                  <CardContent className="relative flex items-center justify-center ">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-[#202020]"></div>

                    {/* Content */}
                    <Link to={game.path} className="lg:mt-0 mt-24 relative lg:mx-16 z-10 gap-8 h-96 flex lg:flex-row flex-col-reverse justify-between items-center text-white">
                      <div className="lg:w-[40%] flex flex-col justify-center h-full p-4">
                        <h2 className="lg:text-5xl text-2xl font-medium mb-3 ">{game.title}</h2>
                        <p className="lg:text-base text-xs font-extralight mb-3" >{game.description}</p>
                        <p className="lg:text-base text-xs w-fit py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700  font-medium mt-6">Click To Play Now!</p>
                      </div>
                      <div className="h-full lg:w-1/2 p-4 pt-14">
                        <img
                          src={game.img_2}
                          className="lg:w-[80%] h-auto object-contain rounded-md"
                          alt={`Carousel item ${index + 1}`}
                        />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </MaxWidthWrapper>

      {/* Spacing */}
      <MaxWidthWrapper className="flex w-full h-14"></MaxWidthWrapper>

      <MaxWidthWrapper >
        <section className="flex lg:flex-row flex-col justify-center lg:mx-20 pb-8 gap-6 ">
          <div className="w-full flex flex-wrap gap-4 md:justify-start justify-evenly">
            {/* Search */}
            <section className="sticky top-14 h-20 w-full py-2 flex flex-row justify-between items-center lg:pr-16 gap-6 text-xs border-b-[1px] bg-white">
              <p className="text-xl font-medium">Modules</p>
              <div className="lg:w-1/3 w-full flex flex-row items-center border-[1px] rounded-lg overflow-hidden bg-slate-100">
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
            {Array.isArray(filteredModules) && filteredModules.length > 0 ? (
              filteredModules.map((module, index) => (
                <section
                  key={index}
                  className="h-72 flex flex-col justify-between  lg:w-72 md:w-64 w-56 rounded-md border-[1px] bg-white overflow-hidden"
                >
                  <div className="w-full h-36 p-3 bg-red-900 text-white">
                    <h2 className="text-lg font-medium line-clamp-3">{module.name}</h2>
                  </div>
                  <div className="w-full h-20 p-3 flex flex-row flex-wrap gap-2 ">
                    {module.tags.map((tag, index) => (
                      <p
                        key={index}
                        className="h-fit border-2 px-2 py-1 rounded-lg lg:text-[0.6rem] text-[0.45rem] tracking-wide"
                      >
                        {tag}
                      </p>
                    ))}
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
          {/* Scores */}
          <div className="h-[70vh] lg:w-1/3 sticky top-20">
            <p className="font-medium mb-2">Recent Feedback</p>
            <div className="h-[60vh] mb-4 flex flex-col gap-4 border-y-2 py-4 border-gray-600 overflow-y-auto">
              {Array.isArray(moduleScores) && moduleScores.length > 0 ? (
                moduleScores.map((scores, index) => {
                  const module = findModules.find((mod) => mod.id === scores.module_id);
                  return (
                    <Link to={`units/docs/${module.id}`}
                      className="flex flex-col p-4 rounded-md gap-2 text-[.8rem] text-gray-500 bg-slate-50 hover:bg-slate-100 hover:border-slate-600 border-[1px] "
                      key={index}>
                      <h3 className="text-[.82rem] text-red-950">{module?.title || "Unknown Module"}</h3>
                      {scores.passed ?
                        <p className="flex items-center bg-green-600 text-white w-fit px-2"><CheckIcon className="mr-1" /> Passed</p>
                        :
                        <p className="flex items-center bg-red-600 text-white w-fit px-2"><CloseIcon className="mr-1" /> Failed</p>
                      }
                      <div className="flex flex-row justify-between items-center">
                        <p>{scores.score} out of {scores.perfect_score}</p>
                        {scores.completion_date ? <p>{new Date(scores.completion_date).toLocaleDateString()}</p>
                          : <p>No Date</p>}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p>No Quizzes</p>
              )}
            </div>
            <Link to={"/profile"} className="text-sm py-2 px-4 rounded-sm text-white bg-red-900 hover:bg-red-700">Reviewer</Link>
          </div>
        </section>
      </MaxWidthWrapper>
      <Footer />
    </div>
  );
}

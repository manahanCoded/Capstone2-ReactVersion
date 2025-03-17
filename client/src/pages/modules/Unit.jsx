import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Footer from "@/components/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Unit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [checkUser, setCheckUser] = useState(null);
    const [units, setUnits] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [moduleName, setModuleName] = useState([]);


    useEffect(() => {
        async function checkUserStatus() {
            try {
                const res = await fetch(`${API_URL}/api/user/profile`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) {
                    navigate("/user/login");
                    return;
                }
                const data = await res.json();
                setCheckUser(data);
            } catch (err) {
                navigate("/user/login");
            }
        }

        checkUserStatus();
    }, [navigate]);

    useEffect(() => {
        async function fetchUnitsAndScores() {
            try {
                const unitsRes = await axios.get(`${API_URL}/api/module/module-units/${id}`);
                setUnits(unitsRes.data.listall);

                if (checkUser) {
                    const scoresRes = await axios.get(`${API_URL}/api/module/get-user-score/${checkUser.id}`);
                    setUserScores(scoresRes.data);
                }

                const moduleData = await axios.get(`${API_URL}/api/module/allModule-storage/${id}`);
                if (moduleData.data.success && moduleData.data.listall.length > 0) {
                    const module = moduleData.data.listall[0];
                    setModuleName({
                        ...module,
                        file_url: module.file_data ? `data:image/png;base64,${module.file_data}` : null,
                        achievement_url: module.achievement_image_data ? `data:image/png;base64,${module.achievement_image_data}` : null,
                    });

                } else {
                    setModuleName(null);
                    alert("Module not found");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        if (id) {
            fetchUnitsAndScores();
        }
    }, [id, checkUser]);

    return (
        <div className="h-screen mt-14 ">
            <MaxWidthWrapper className="md:pr-0 bg-gray-50 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                <section className="flex md:flex-row flex-col-reverse justify-center lg:ml-20  gap-6 ">
                    <div className="w-full mt-14">
                        <div>
                            <div className="w-full flex flex-row justify-between items-center">
                                <img className="h-5 "
                                    src="/IMG_Modules/LOGO_maroon.png" alt="" />
                            {checkUser?.role === "admin" && (
                                <Link
                                    to={`/modules/create-unit/${id}`}
                                    className="rounded-sm py-2 px-4 font-medium bg-[#333333] hover:bg-[#121212] text-white"
                                >
                                    Add Unit
                                </Link>
                            )}
                            </div>
                            <h1 className="text-[2.5rem] text-red-900 font-light mt-1">{moduleName.name}</h1>
                            <p className="mt-4 text-sm">🛠️ Blockchain may seem tough now, but soon it'll click!</p>
                            <p className="mt-4 text-">Web3 is the next evolution of the internet, leveraging
                                decentralization, blockchain, and smart contracts to empower users with transparency, security, and digital ownership.</p>
                        </div>
                    </div>
                    <div className=" lg:w-4/6  top-20">
                        <div className="h-[30rem] w-full relative">
                            {moduleName.file_url &&
                            <img className="absolute inset-0 aspect-[20/13] h-full z-10 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                src={moduleName.file_url} alt="" />
                            }
                        </div>
                    </div>
                </section>
            </MaxWidthWrapper>
            <MaxWidthWrapper className="md:pr-0 ">
                <section className=" flex md:flex-row flex-col justify-center lg:ml-20  gap-6 ">
                    <div className="relative w-full">
                        <div className="absolute -top-40 inset-0 w-full h-64 rounded p-4 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                            <h3 className="w-fit text-lg font-semibold text-[#333333] p-2 border-b-4 border-red-900">Description</h3>
                            <p className="my-8 text-sm text-gray-600 line-clamp-4">{moduleName.description}</p>
                            <div className=" px-10 w-ful flex justify-end self-center">
                                <a className="px-4 py-2 text-white rounded-3xl text-sm bg-red-900 hover:bg-red-700 w-ful flex justify-end self-center" href="#start">Get Started</a>
                            </div>
                        </div>
                        <h4 id="start" className="mt-32 mb-8 text-4xl font-extralight">Insights you'll uncover.</h4>
                        {units.length > 0 ? (
                            <div className="flex flex-col gap-5 pb-8">
                                {units.map((unit, index) => {
                                    const userScore = userScores.find((score) => score.module_id === unit.id);
                                    const isCompleted = userScore?.completed;
                                    return (
                                        <Link
                                            to={`/modules/units/docs/${unit.id}`}
                                            key={index}
                                            className="relative group flex flex-row items-center justify-between px-4 pr-8 py-6 rounded text-sm hover:bg-red-700 hover:text-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all duration-300"
                                        >
                                            {isCompleted && (
                                                <CheckCircleIcon
                                                    className="absolute right-1 -top-5"
                                                    style={{ height: "2.5rem", width: "2.5rem", color: "#22C55E" }}
                                                />
                                            )}
                                            <div className="flex flex-row items-center gap-6">
                                                <SchoolOutlinedIcon
                                                    className="group-hover:text-white text-red-900"
                                                    style={{ height: "2.5rem", width: "2.5rem" }}
                                                />
                                                <p className="text-lg font-medium line-clamp-1">{unit?.title}</p>
                                            </div>
                                            <div className="flex flex-row items-center justify-end">
                                                {checkUser?.role === "admin" && (
                                                    <Link
                                                        to={`/modules/units/edit/${unit.id}`}
                                                        className="rounded-sm py-2 px-4 font-medium mr-2 border-[1px] border-gray-300 hover:bg-[#333333] hover:text-white"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                            </div>
                                        </Link>

                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">No units found.</div>
                        )}
                    </div>
                    <div className="lg:block hidden mt-0.5 bg-gray-50 lg:w-4/6 ">
                        <div className="h-64 p-8 border-b ">
                            <h3 className="text-lg font-semibold text-red-900  ">Achievements</h3>
                            <p className="text-sm mt-2">Badge you can earn by completing the module.</p>
                            <div className="mt-4 h-[6rem] w-[6rem]  relative">
                                <img className="absolute inset-0 w-full h-full object-cover z-10"
                                    src={moduleName.achievement_url} alt="" />
                            </div>
                        </div>
                        <h3 className=" px-8 pt-4 text-lg  font-semibold text-[#333333]  ">Completed Units</h3>
                        {units.length > 0 ? (
                            <div className="h-96 flex flex-col p-8  border-b ">
                                {units.map((unit, index) => {
                                    const userScore = userScores.find((score) => score.module_id === unit.id);
                                    const score = userScore?.score || 0;
                                    const passed = userScore?.passed ? userScore?.passed  : "Untaken";
                                    const completedUnits = units.filter((unit) => {
                                        const userScore = userScores.find((score) => score.module_id === unit.id);
                                        return userScore?.completed === true;  //
                                    });
                                    return (
                                        <Link
                                            to={`/modules/units/docs/${unit.id}`}
                                            key={unit.id}
                                            className="border mb-2 border-gray-200 py-2 text-sm group rounded-md relative bg-white hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 ease-in-out"
                                        >
                                            <p className=" px-4 text-sm line-clamp-1 font-semibold group-hover:text-red-600">
                                                {unit?.title}
                                            </p>
                                            {completedUnits ? (
                                                <div className="px-4 flex flex-row justify-between text-gray-500 mt-2">
                                                    <p>{passed}</p>
                                                    <p>Score: {score}</p>
                                                </div>
                                            ) : (
                                                <div className="text-red-500 mt-2">
                                                    <p>Not completed yet</p>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out"></div>
                                        </Link>

                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">No units found.</div>
                        )}
                    </div>
                </section>
            </MaxWidthWrapper>
            <Footer />
        </div>
    );
}

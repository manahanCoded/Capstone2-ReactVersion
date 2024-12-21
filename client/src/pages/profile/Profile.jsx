
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Edit from "./Edit/Edit";
import Dashboard from "./Dashbord.jsx/Dashboard";
import Reviewer from "./reviewer/Reviewer";
import UserApplications from "./Applications/Applications";



export default function Profile() {
    const navigate = useNavigate()
    const [checkUser, setCheckUser] = useState();
    const [openTab, setOpenTab] = useState("profile")
    
    const handleReview = () => {
        setOpenTab("reviewer");
    };

    useEffect(() => {
        async function checkUser() {
            try {
                const res = await fetch("http://localhost:5000/api/user/profile", {
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
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        navigate("/user/login");
                    }
                } else {
                    alert("Failed to fetch user profile.");
                    console.error(err);
                }
            }
        }

        checkUser();
    }, [navigate]);


    return (
        <div className="h-screen w-full ">
            <img src="/IMG_Auth/bg_auth.jpg" className="fixed h-screen w-screen -z-10" alt="" />
            <MaxWidthWrapper className="h-screen p-2 m-auto pt-16  ">
                <section className=" flex flex-row  items-center h-full rounded-md border-[1px] bg-white">
                    <section className="flex flex-col items-center gap-6  py-6 rounded-l-md h-full w-72 bg-red-600 text-white">
                        <img src="/Icons/accountWhite.png" alt="" className="h-16 w-16" />
                        <div className="flex flex-col text-center items-center w-full bg-white">
                            <p className={` ${openTab === "profile" ? "bg-white border-l-4 border-black" : "bg-gray-100 "} p-3 w-full  hover:bg-slate-400   text-black cursor-pointer`}
                                onClick={() => setOpenTab("profile")}
                            >
                                Profile
                            </p>
                            <p className={` ${openTab === "dashboard" ? "bg-white border-l-4 border-black" : "bg-gray-100 "} p-3 w-full hover:bg-slate-400   text-black cursor-pointer`}
                                onClick={() => setOpenTab("dashboard")}
                            >
                                Dashboard
                            </p>
                            <p className={` ${openTab === "applicantion" ? "bg-white border-l-4 border-black" : "bg-gray-100 "} p-3 w-full hover:bg-slate-400   text-black cursor-pointer`}
                                onClick={() => setOpenTab("applicantion")}
                            >
                                 Applications
                            </p>
                            <p className={` ${openTab === "reviewer" ? "bg-white border-l-4 border-black" : "bg-gray-100 "} p-3 w-full hover:bg-slate-400   text-black cursor-pointer`}
                                onClick={() => setOpenTab("reviewer")}
                            >
                                 Reviewer
                            </p>
                        </div>
                    </section>
                    <div className="w-full h-full px-4 py-2 ">
                    {openTab === "profile" && <Edit />}
                    {openTab === "applicantion" ? checkUser && <UserApplications checkUser={checkUser} />: null}
                    {openTab === "dashboard" && <Dashboard review={handleReview} />}
                    {openTab === "reviewer" && <Reviewer />}
                    </div>
                </section>
            </MaxWidthWrapper>
        </div>
    )
}
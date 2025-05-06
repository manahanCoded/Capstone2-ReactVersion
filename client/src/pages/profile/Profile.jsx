
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Dashboard from "./Dashbord/Dashboard";
import Reviewer from "./reviewer/Reviewer";
import UserApplications from "./Applications/Applications";
import Footer from "@/components/Footer";
import PickedOption from "./ProfileOptions/PickedOption";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function Profile() {
    const navigate = useNavigate()
    const [checkUser, setCheckUser] = useState();
    const [openTab, setOpenTab] = useState("profile")


    useEffect(() => {
        async function checkUser() {
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
                    console.error(err);
            }
        }

        checkUser();
    }, [navigate]);


    return (
        <div className=" w-full mt-14 bg-slate-100">
      
            <MaxWidthWrapper className=" flex md:flex-row flex-col py-2 h-fit  rounded-md ">
                <section className="sticky top-16 rounded-lg flex flex-col items-center gap-6 md:py-6  md:h-[90vh] h-12 md:w-80 w-full md:mb-0 mb-4  bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                
                    <nav className="z-50 flex  w-full md:flex-col flex-row sm:text-base text-xs ">
                        {[
                            { id: "profile", label: "Profile", icon:<AccountBoxIcon/> },
                            { id: "dashboard", label: "Dashboard", icon: <DashboardIcon/> },
                            { id: "applicantion", label: "Applications", icon: <EmailIcon/> },
                            { id: "reviewer", label: "Reviewer", icon: <CollectionsBookmarkIcon/> },
                        ].map((tab) => (
                            <div
                                key={tab.id}
                                className={`flex items-center md:justify-between justify-center md:pl-4 md:px-0 px-2 py-3 w-full cursor-pointer mb-4 
                    ${openTab === tab.id ? "bg-white text-red-700 font-semibold md:border-r-4 border-red-800" : " hover:bg-red-600 hover:text-white text-[#333333]"} 
                    transition duration-200 ease-in-out `}
                                onClick={() => setOpenTab(tab.id)}
                            >
                                <div className="flex flex-row items-center  gap-1 ">
                                {tab.icon}  
                                  <p className="md:block hidden">{tab.label}</p>
                                </div>
                            </div>
                        ))}
                    </nav>
                </section>

                <section className="z-10 w-full h-full md:pl-4 rounded-lg">
                    {openTab === "profile" && <PickedOption />}
                    {openTab === "applicantion" ? checkUser && <UserApplications checkUser={checkUser} /> : null}
                    {openTab === "dashboard" && <Dashboard />}
                    {openTab === "reviewer" && <Reviewer />}
                </section>
            </MaxWidthWrapper>
            <Footer/>
        </div>
    )
}

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Edit from "./Edit/Edit";
import Dashboard from "./Dashbord.jsx/Dashboard";
import Reviewer from "./reviewer/Reviewer";
import UserApplications from "./Applications/Applications";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Footer from "@/components/Footer";


export default function Profile() {
    const navigate = useNavigate()
    const [checkUser, setCheckUser] = useState();
    const [openTab, setOpenTab] = useState("profile")


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
        <div className="h-fit w-full pt-14">
            <section className=" flex md:flex-row flex-col  h-fit  rounded-md ">
                <section className="sticky top-14 flex flex-col items-center gap-6 py-6 h-screen md:w-80 w-full bg-red-900 text-white shadow-lg ">
                    <img src="/Icons/accountWhite.png" alt="User Icon" className="h-20 w-20 rounded-full border-4 border-white shadow-md" />
                    <h3>{checkUser?.email}</h3>
                    <nav className="flex flex-col w-full">
                        {[
                            { id: "profile", label: "Profile" },
                            { id: "dashboard", label: "Dashboard" },
                            { id: "applicantion", label: "Applications" },
                            { id: "reviewer", label: "Reviewer" },
                        ].map((tab) => (
                            <div
                                key={tab.id}
                                className={`flex items-center justify-between px-4 py-3 w-full cursor-pointer 
                    ${openTab === tab.id ? "bg-white text-black font-semibold" : " hover:bg-red-600"} 
                    transition duration-200 ease-in-out rounded-md`}
                                onClick={() => setOpenTab(tab.id)}
                            >
                                <p>{tab.label}</p>
                                <ArrowForwardIosIcon className={`${openTab === tab.id ? "text-black" : "text-white"}`} />
                            </div>
                        ))}
                    </nav>
                </section>

                <section className="w-full h-full px-4 py-2 ">
                    {openTab === "profile" && <Edit />}
                    {openTab === "applicantion" ? checkUser && <UserApplications checkUser={checkUser} /> : null}
                    {openTab === "dashboard" && <Dashboard />}
                    {openTab === "reviewer" && <Reviewer />}
                </section>
            </section>
            <Footer/>
        </div>
    )
}
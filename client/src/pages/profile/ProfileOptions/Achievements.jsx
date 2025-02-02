import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Achievements() {
    const navigate = useNavigate();
    const [checkUser, setCheckUser] = useState({
        type: "",
        email: "",
        name: "",
        lastname: "",
        password: "",
        image: "",
    });


    useEffect(() => {
        async function fetchUser() {
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
                console.error("Failed to fetch user profile:", err);
                navigate("/user/login");
            }
        }

        fetchUser();
    }, [navigate]);


    return (
        <div >
            <section className="mt-6 text-sm">
                <form className="flex flex-col gap-4">
                    <section className="flex md:flex-row flex-col justify-between gap-4">
                        <div className="w-fit">
                            <label className="">Your Profile  Picture
                                <div className="mt-3 flex justify-center items-center flex-col p-2 rounded-2xl border-2 border-dashed border-gray-500  bg-gray-200 ">
                                    <img
                                        src={
                                            checkUser.image
                                                ? `data:${checkUser.file_mime_type};base64,${checkUser.image}`
                                                : "/Icons/AddPic.png"
                                        }
                                        className="h-24 w-24 object-cover rounded-full"
                                        alt="Profile Picture"
                                    />
                                </div>
                            </label>
                        </div>
                        <div className="xl:w-[85%] md:w-[80%]">
                            <section className="flex flex-row gap-x-5 mb-2">
                                <div className="w-[48%] flex flex-col gap-2">
                                    <label >Name</label>
                                    <p
                                        className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                                        {checkUser?.name ? checkUser.name : "Please edit name"}
                                    </p>
                                </div>
                                <div className="w-[48%] flex flex-col gap-2">
                                    <label >Last name</label>
                                    <p
                                        className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                                        {checkUser?.lastname ? checkUser.lastname : "Please edit last name"}
                                    </p>
                                </div>
                            </section>
                            <section className="flex flex-row gap-5">
                                <div className="w-[48%] flex flex-col gap-2">
                                    <label >Email</label>
                                    <p
                                        className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                                        {checkUser?.email ? checkUser.email : "Please edit email"}
                                    </p>
                                </div>
                            </section>
                        </div>
                    </section>
                    <section className="w-full border-b-2 bg-gray-200"></section>

                </form>
            </section>
        </div>
    );
}


import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Edit() {
    const navigate = useNavigate();
    const [checkUser, setCheckUser] = useState({
        type: "",
        email: "",
        password: "",
    });
    const [formData, setFormData] = useState({ email: "", oldPassword: "", newPassword: "", confirmPassword: "" });

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
                setFormData({ email: data.email, oldPassword: "", newPassword: "", confirmPassword: "" });
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
                navigate("/user/login");
            }
        }

        fetchUser();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put("http://localhost:5000/api/user/update", formData, {
                withCredentials: true,
            });
            if (res.status === 200) {
                alert("Profile updated successfully!");
                navigate("/profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="w-full ">
            <div className="m-auto ">
                <section className=" ">
                    <form
                        className="flex flex-col justify-between p-4 rounded-l-md h-full "
                        onSubmit={handleFormSubmit}
                    >
                        <div className=" flex flex-col gap-4 items-center ">
                            <h2 className="text-2xl tracking-wide font-semibold">Edit Profile</h2>
                            <div className="flex justify-center flex-col items-center mt-8 gap-4 px-4 w-full">
                                <img src="/Icons/account.png" alt="Profile Icon" className="h-20 w-20" />
                                {checkUser.type === 'google' ?
                                    <div>
                                        <h2>Google Accounts cannot be edited.</h2>
                                    </div>
                                    :

                                    <div className="flex flex-col items-center gap-4 w-[60%]">

                                        <h3>{formData.email} </h3>
                                        <input
                                            type="password"
                                            name="oldPassword" // Updated name attribute
                                            value={formData.oldPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm Old Password"
                                            className="rounded-sm py-2 px-3 w-[80%] bg-gray-100 border border-gray-300 text-black"
                                        />

                                        <input
                                            type="password"
                                            name="newPassword" // Updated name attribute
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            placeholder="New Password (optional)"
                                            className="rounded-sm py-2 px-3 w-[80%] bg-gray-100 border border-gray-300 text-black"
                                        />

                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm Password"
                                            className="rounded-sm py-2 px-3 w-[80%] bg-gray-100 border border-gray-300 text-black"
                                        />
                                    </div>
                                }

                            </div>
                            <div className="px-6 flex justify-end gap-2 text-sm w-[50%]">
                                {checkUser.type === 'google' ?
                                    null :
                                    <button
                                        type="submit"
                                        className="bg-[#333333] text-white border-[1px] hover:bg-black rounded-sm px-4 py-2"
                                    >
                                        Confirm
                                    </button>
                                }
                            </div>
                        </div>

                    </form>
                </section>
            </div>
        </div>
    );
}

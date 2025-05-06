
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditProfile() {
    const navigate = useNavigate();
    const [editPassword, setEditPassword] = useState(false)
    const [checkUser, setCheckUser] = useState({
        type: "",
        email: "",
        name: "",
        lastname: "",
        image: "",
        file_mime_type: "",
        phone_number: ""
    });
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        lastname: "",
        image: "",
        file_mime_type: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        phone_number: "",
    });

    useEffect(() => {
        async function fetchUser() {
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
                setFormData({
                    email: data.email,
                    name: data.name || "",
                    lastname: data.lastname || "",
                    image: data.image || "",
                    file_mime_type: data.file_mime_type || "",
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                    phone_number: data.phone_number || "",
                });
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
                navigate("/user/login");
            }
        }

        fetchUser();
    }, [navigate]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setFormData((prev) => ({
            ...prev,
            image: file,
            file_mime_type: file.type
        }));

    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("email", formData.email);
        formDataToSend.append("name", formData.name);
        formDataToSend.append("lastname", formData.lastname);
        formDataToSend.append("oldPassword", formData.oldPassword);
        formDataToSend.append("newPassword", formData.newPassword);
        formDataToSend.append("confirmPassword", formData.confirmPassword);
        formDataToSend.append("image", formData.image);
        formDataToSend.append("phone_number", formData.phone_number);

        try {
            const res = await axios.put(`${API_URL}/api/user/update`, formDataToSend, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                alert(res.data.message || "Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.message || "Failed to update profile. Please try again.");
        }
    };

    return (
        <div>
            <section className="mt-6 text-sm">
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                    <section className="flex md:flex-row flex-col justify-between gap-4">
                        <div className="w-fit">
                            <label>Your Profile Picture
                                <div className="mt-3 flex justify-center items-center flex-col p-4 rounded-2xl border-2 border-dashed border-gray-500 bg-gray-200 cursor-pointer">
                                    <img
                                        src={formData.image instanceof File ? URL.createObjectURL(formData.image) : "/Icons/AddPic.png"}
                                        className="h-12"
                                        alt="Profile Preview"
                                    />
                                    <p className="text-center text-xs">Upload your <br />photo</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </label>
                            {checkUser.type !== "google"&&
                            <button
                                type="button"
                                onClick={() => setEditPassword(!editPassword)}
                                className="mt-7 w-full md:h-10 h-8 py-2.5 rounded px-2 text-white bg-[#333333] hover:bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                            >
                                Edit Password
                            </button>
                            }
                        </div>

                        <div className="xl:w-[85%] md:w-[80%]">
                            {editPassword ?
                                <section className="flex flex-row gap-x-5 mb-2">
                                    <div className="w-[48%] flex flex-col gap-2">
                                        <label >Old Password</label>
                                        <input type="password"
                                            value={formData.oldPassword}
                                            onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                                            placeholder="Input your old password"
                                            className="md:h-10 h-8 rounded px-2 border-[1px] border-black" />
                                    </div>
                                    <div className="w-[48%] flex flex-col gap-2">
                                        <label >New password</label>
                                        <input type="password"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            placeholder="Enter new password"
                                            className="md:h-10 h-8 rounded px-2 border-[1px] border-black" />
                                    </div>
                                </section>
                                :
                                <section className="flex flex-row gap-x-5 mb-2">
                                    <div className="w-[48%] flex flex-col gap-2">
                                        <label >Name</label>
                                        <input type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Name"
                                            className="md:h-10 h-8 rounded px-2 border-[1px] border-black" />
                                    </div>
                                    <div className="w-[48%] flex flex-col gap-2">
                                        <label >Last name</label>
                                        <input type="text"
                                            value={formData.lastname}
                                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                            placeholder="Last name"
                                            className="md:h-10 h-8 rounded px-2 border-[1px] border-black" />
                                    </div>
                                </section>
                            }
                            {editPassword ?
                                <section className="flex flex-row gap-5">
                                    <div className="w-[48%] flex flex-col gap-2">
                                        <label >Confrim Password</label>
                                        <input type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder="Re-enter new password"
                                            className="md:h-10 h-8 rounded px-2 border-[1px] border-black" />
                                    </div>
                                </section>
                                :
                                <section className="flex flex-row gap-5">
                                    <div className="w-[48%] flex flex-col gap-2">
                                        <label >Email</label>
                                        <p
                                            className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                                            {checkUser?.email ? checkUser.email : "Please edit email"}
                                        </p>
                                    </div>
                                    <div className="w-[48%] flex flex-col gap-2">
                                        <label >Phone number</label>
                                        <input
                                            type="tel"
                                            placeholder="Mobile number"
                                            value={formData.phone_number}
                                            onChange={(e) => {
                                                const onlyNumbers = e.target.value.replace(/\D/g, "");
                                                setFormData({ ...formData, phone_number: onlyNumbers });
                                            }}
                                           className="md:h-10 h-8 rounded px-2 border-[1px] border-black"
                                        />
                                    </div>
                                </section>
                            }
                            <button className=" w-[48%] mt-7 md:h-10 h-8 py-2.5 rounded px-2 text-white bg-red-900 hover:bg-red-700 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                                Submit
                            </button>
                        </div>
                    </section>
                </form>
            </section>
        </div>
    );
}

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PickedOption() {
    const [activeTab, setActiveTab] = useState("achievements");
    const navigate = useNavigate();
    const [achievementsData, setAchievementsData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editPassword, setEditPassword] = useState(false);

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


    const fetchUserData = useCallback(async () => {
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
            setUserData(data);
            setFormData(prev => ({
                ...prev,
                email: data.email,
                name: data.name || "",
                lastname: data.lastname || "",
                image: data.image || "",
                file_mime_type: data.file_mime_type || "",
                phone_number: data.phone_number || "",
            }));
            return data;
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            setError(err.message);
            navigate("/user/login");
        }
    }, [navigate]);


    const fetchAchievementsData = useCallback(async (userId) => {
        setLoading(true);
        try {
            const achievementsRes = await axios.get(
                `${API_URL}/api/module/achievements/${userId}`
            );

            if (achievementsRes.data.success) {
                setAchievementsData(achievementsRes.data.data);
            } else {
                setError("Failed to load achievements data");
            }
        } catch (err) {
            console.error("Error fetching achievements:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        const loadData = async () => {
            const user = await fetchUserData();
            if (user?.id) {
                await fetchAchievementsData(user.id);
            }
        };
        
        loadData();
    }, [fetchUserData, fetchAchievementsData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            image: file,
            file_mime_type: file.type
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
  


        if (formData.phone_number && formData.phone_number.length < 11) {
            alert("Phone number must be at least 11 digits");
            return;
        }
        if (editPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                alert("New passwords don't match!");
                return;
            }
            if (formData.newPassword.length < 8) {
                alert("Password must be at least 8 characters long");
                return;
            }
        }

        const formDataToSend = new FormData();
        formDataToSend.append("email", formData.email);
        formDataToSend.append("name", formData.name);
        formDataToSend.append("lastname", formData.lastname);
        formDataToSend.append("phone_number", formData.phone_number);
        
        if (editPassword) {
            formDataToSend.append("oldPassword", formData.oldPassword);
            formDataToSend.append("newPassword", formData.newPassword);
            formDataToSend.append("confirmPassword", formData.confirmPassword);
        }
        
        if (formData.image instanceof File) {
            formDataToSend.append("image", formData.image);
        }

        try {
            const res = await axios.put(`${API_URL}/api/user/update`, formDataToSend, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                alert(res.data.message || "Profile updated successfully!");
                await fetchUserData();
                setEditPassword(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.message || "Failed to update profile. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneNumberChange = (e) => {
        const onlyNumbers = e.target.value.replace(/\D/g, "");
        const formattedNumber = onlyNumbers.slice(0, 11);
        setFormData(prev => ({ ...prev, phone_number: formattedNumber }));
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[90vh]">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[90vh]">
                <p className="text-red-500 text-lg">Error: {error}</p>
            </div>
        );
    }

    if (!userData || !achievementsData) {
        return (
            <div className="flex justify-center items-center h-[90vh]">
                <p className="text-lg">No data available</p>
            </div>
        );
    }

    return (
        <div className="w-full xl:h-[90vh] h-fit py-8 px-6 rounded-lg bg-white shadow-lg">

            <section className="flex text-sm tracking-wide text-gray-500">
                <button 
                    onClick={() => setActiveTab("achievements")} 
                    className={`w-44 pb-2 border-b-2 transition-colors ${
                        activeTab === "achievements" 
                            ? "text-red-800 border-red-600" 
                            : "border-gray-200 hover:text-gray-700"
                    }`}
                >
                    Achievements
                </button>
                <button 
                    onClick={() => setActiveTab("edit")} 
                    className={`w-44 pb-2 border-b-2 transition-colors ${
                        activeTab === "edit" 
                            ? "text-red-800 border-red-600" 
                            : "border-gray-200 hover:text-gray-700"
                    }`}
                >
                    Account Settings
                </button>
            </section>


            {activeTab === "achievements" ? (
                <AchievementsTab userData={userData} achievementsData={achievementsData} />
            ) : (
                <EditProfileTab 
                    userData={userData} 
                    formData={formData} 
                    editPassword={editPassword}
                    setEditPassword={setEditPassword}
                    handleFileChange={handleFileChange}
                    handleInputChange={handleInputChange}
                    handlePhoneNumberChange={handlePhoneNumberChange}
                    handleFormSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
}

function AchievementsTab({ userData, achievementsData }) {
    return (
        <div className="xl:h-full">
  
            <section className="h-[30%] mt-6 text-sm">
                <div className="flex flex-col gap-4">
                    <section className="flex md:flex-row flex-col justify-between gap-4">
                        <div className="w-fit">
                            <label className="block mb-1">Your Profile Picture</label>
                            <div className="mt-3 flex justify-center items-center flex-col p-2 rounded-2xl border-2 border-dashed border-gray-500 bg-gray-200">
                                <img
                                    src={
                                        userData.image
                                            ? `data:${userData.file_mime_type};base64,${userData.image}`
                                            : "/Icons/AddPic.png"
                                    }
                                    className="h-24 w-24 object-cover rounded-full"
                                    alt="Profile"
                                />
                            </div>
                        </div>
                        <div className="xl:w-[85%] md:w-[80%]">
                            <section className="flex flex-row gap-x-5 mb-2">
                                <ProfileField label="Name" value={userData?.name || "Not provided"} />
                                <ProfileField label="Last name" value={userData?.lastname || "Not provided"} />
                            </section>
                            <section className="flex flex-row gap-5">
                                <ProfileField label="Email" value={userData?.email || "Not provided"} />
                            </section>
                        </div>
                    </section>
                    <div className="w-full border-b-2 bg-gray-200"></div>
                </div>
            </section>

            <section className="h-[60%] mt-6 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Badges</h2>
                {achievementsData.achievements.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {achievementsData.achievements.map((badge, index) => (
                            <div key={index} className="flex flex-col items-center">
                                {badge?.achievement_image_data?
                                <img
                                    src={`data:image/png;base64,${badge.achievement_image_data}`}
                                    alt={badge?.name}
                                    className="w-24 h-24 object-contain"
                                />
                                :
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-5xl">🏆</span>
                                    </div>}
                                <p className="text-xs mt-2 text-center">{badge?.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No achievements yet. Complete modules to earn badges!</p>
                )}
            </section>
        </div>
    );
}

function EditProfileTab({
    userData,
    formData,
    editPassword,
    setEditPassword,
    handleFileChange,
    handleInputChange,
    handlePhoneNumberChange,
    handleFormSubmit
}) {
    return (
        <div>
            <section className="mt-6 text-sm">
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                    <section className="flex md:flex-row flex-col justify-between gap-4">
                     
                        <div className="w-fit">
                            <label className="block mb-1">Your Profile Picture</label>
                            <label className="mt-3 flex justify-center items-center flex-col p-4 rounded-2xl border-2 border-dashed border-gray-500 bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors">
                                <img
                                    src={
                                        formData.image instanceof File 
                                            ? URL.createObjectURL(formData.image) 
                                            : userData.image
                                                ? `data:${userData.file_mime_type};base64,${userData.image}`
                                                : "/Icons/AddPic.png"
                                    }
                                    className="h-12"
                                    alt="Profile Preview"
                                />
                                <p className="text-center text-xs mt-2">Upload your photo</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                            
                            {userData.type !== "google" && (
                                <button
                                    type="button"
                                    onClick={() => setEditPassword(!editPassword)}
                                    className="mt-7 w-full md:h-10 h-8 py-2.5 rounded px-2 text-white bg-gray-800 hover:bg-black transition-colors shadow-md"
                                >
                                    {editPassword ? "Go Back" : "Change Password"}
                                </button>
                            )}
                        </div>

                        <div className="xl:w-[85%] md:w-[80%]">
                            {editPassword ? (
                                <>
                                    <div className="flex flex-row gap-x-5 mb-2">
                                        <FormInput
                                            label="Old Password"
                                            name="oldPassword"
                                            type="password"
                                            value={formData.oldPassword}
                                            onChange={handleInputChange}
                                            placeholder="Current password"
                                            required
                                        />
                                        <FormInput
                                            label="New Password"
                                            name="newPassword"
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            placeholder="New password"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-row gap-5">
                                        <FormInput
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-row gap-x-5 mb-2">
                                        <FormInput
                                            label="Name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Your name"
                                        />
                                        <FormInput
                                            label="Last Name"
                                            name="lastname"
                                            type="text"
                                            value={formData.lastname}
                                            onChange={handleInputChange}
                                            placeholder="Your last name"
                                        />
                                    </div>
                                    <div className="flex flex-row gap-5">
                                        <div className="w-[48%] flex flex-col gap-2">
                                            <label>Email</label>
                                            <p className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow-md">
                                                {userData?.email || "Not provided"}
                                            </p>
                                        </div>
                                        <FormInput
                                            label="Phone Number"
                                            name="phone_number"
                                            type="tel"
                                            value={formData.phone_number}
                                            onChange={handlePhoneNumberChange}
                                            placeholder="Mobile number"
                                        />
                                    </div>
                                </>
                            )}
                            
                            <button 
                                type="submit"
                                className="w-[48%] mt-7 md:h-10 h-8 py-2.5 rounded px-2 text-white bg-red-900 hover:bg-red-700 transition-colors shadow-md"
                            >
                                Save Changes
                            </button>
                        </div>
                    </section>
                </form>
            </section>
        </div>
    );
}


function ProfileField({ label, value }) {
    return (
        <div className="w-[48%] flex flex-col gap-2">
            <label>{label}</label>
            <p className="md:h-10 h-8 py-2.5 rounded px-2 bg-gray-100 shadow-md">
                {value}
            </p>
        </div>
    );
}

function FormInput({ label, name, type, value, onChange, placeholder, required = false }) {
    return (
        <div className="w-[48%] flex flex-col gap-2">
            <label>{label}{required && <span className="text-red-500">*</span>}</label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="md:h-10 h-8 rounded px-2 border border-gray-300 focus:border-red-500 focus:outline-none transition-colors"
            />
        </div>
    );
}
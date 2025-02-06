import axios from "axios";
import { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function CreateModulePage() {
    const [checkAdmin, setCheckAdmin] = useState();
    const [modules, setModules] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [fileName, setFileName] = useState("No file selected")
    const [fileNameAchievement, setFileNameAchievement] = useState("No file selected")
    const [editFileName, setEditFileName] = useState("Edit file image")
    const [editAchievementFileName, setEditAchievementFileName] = useState("Edit Achievement image")
    const [newModule, setNewModule] = useState({
        name: "",
        description: "",
        tags: "",
        created_by: "",
        selectedFile: null,
        achievementFile: "",
        difficulty_level: ""
    });


    const [editModule, setEditModule] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function handleCheckAdmin() {
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

                setNewModule({ ...newModule, created_by: data.id })
                if (data.role === "client") {
                    navigate("/modules");
                }
            } catch (err) {
                console.error("An error occurred:", err);
                alert("Failed to fetch user profile.");
            }
        }

        handleCheckAdmin();
    }, [navigate]);



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewModule({ ...newModule, selectedFile: file });
        setFileName(file ? file.name : "No file selected");
    };


    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditModule((prev) => ({
                ...prev,
                selectedFile: file,
            }));
            setEditFileName(file.name);
        }
    };

    const handleAchievement_FileChange = (e) => {
        const file = e.target.files[0]
        setNewModule({ ...newModule, achievementFile: file })
        setFileNameAchievement(file ? file.name : "No file selected");
    }

    const handleEditAchievementFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditModule((prev) => ({
                ...prev,
                achievementFile: file,
            }));
            setEditAchievementFileName(file.name);
        }
    };

    const handleCreateModule = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", newModule.name);
            formData.append("description", newModule.description);
            formData.append("difficulty_level", newModule.difficulty_level);

            // Convert tags string into an array and store as JSON
            const tagsArray = newModule.tags.split(",").map(tag => tag.trim()).filter(Boolean);
            formData.append("tags", JSON.stringify(tagsArray));

            formData.append("created_by", newModule.created_by);

            if (newModule.selectedFile) {
                formData.append("file", newModule.selectedFile); 
            }
            if (newModule.achievementFile) {
                formData.append("achievement_image", newModule.achievementFile); 
            }

            const res = await axios.post("http://localhost:5000/api/module/createModule", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 201) {
                alert("Module created successfully!");
                setShowCreateForm(false);
                setNewModule({
                    name: "",
                    description: "",
                    tags: "",
                    created_by: newModule.created_by,
                    difficulty_level: "",
                });
                setModules((prev) => [...prev, res.data.newModule]);
                setFileName("No file selected");
            }
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.data.error || "An error occurred, please try again."}`);
            } else {
                alert("Network error or server is down. Please try again later.");
            }
        }
    };


    const handleUpdateModule = async (e) => {
        e.preventDefault();
        if (!editModule) return;

        try {
            const tagsArray = typeof editModule.tags === "string"
                ? editModule.tags.split(",").map(tag => tag.trim()).filter(Boolean)
                : editModule.tags;

            // Prepare the form data
            const formData = new FormData();
            formData.append("name", editModule.name);
            formData.append("description", editModule.description);
            formData.append("difficulty_level", editModule.difficulty_level);
            formData.append("tags", JSON.stringify(tagsArray)); 
            if (editModule.selectedFile) {
                formData.append("file", editModule.selectedFile);
            }

            if (editModule.achievementFile) {
                formData.append("achievement_image", editModule.achievementFile); 
            }

            const res = await axios.put(
                `http://localhost:5000/api/module/updateModule/${editModule.id}`,
                formData
            );

            if (res.status === 200) {
                alert("Module updated successfully!");
                setModules((prev) =>
                    prev.map((module) =>
                        module.id === editModule.id ? res.data.updatedModule : module
                    )
                );
                setIsEditing(false);
                setEditModule(null);
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error || "Failed to update module.");
            } else {
                alert("An unexpected error occurred.");
            }
            console.error("Error updating module:", error);
        }
    };



    useEffect(() => {
        async function handleModules() {
            try {
                const response = await axios.get("http://localhost:5000/api/module/allModule-storage");

                if (response.data.success && response.data.listall) {
                    const updatedModules = response.data.listall.map(module => ({
                        ...module,
                        file_url: module.file_data ? `data:image/png;base64,${module.file_data}` : null
                    }));

                    setModules(updatedModules);

                } else {
                    console.error("Error fetching modules:", response.data.message);
                    setModules([]);
                }
            } catch (error) {
                console.error("Error fetching modules:", error);
                setModules([]);
            }
        }
        handleModules();
    }, [handleUpdateModule]);


    const handleDeleteModule = async (id) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;

        try {
            const res = await axios.delete(`http://localhost:5000/api/module/removeModule/${id}`);

            if (res.status === 200) {
                alert("Module deleted successfully!");
                setModules((prev) => prev.filter((module) => module.id !== id));
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error || "Failed to delete module.");
            } else {
                alert("An unexpected error occurred.");
            }
            console.error("Error deleting module:", error);
        }
    };

    const filteredModules = modules?.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="h-screen mt-14">
            <div className="w-full flex flex-wrap gap-4 md:justify-start justify-evenly">
                {/* Search */}
                <section className="sticky z-20 top-14 h-20 w-full px-8 py-2 flex flex-row justify-between items-center lg:pr-16 gap-6 text-xs border-b-[1px] bg-white">
                    <p className="lg:text-xl text-sm font-medium">Modules</p>
                    <div className="lg:w-1/3 md:w-1/2 w-full  flex flex-row items-center border-[1px] rounded-lg overflow-hidden bg-slate-100">
                        <input
                            placeholder="Search Module"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 w-full py-2 pl-4 outline-none bg-slate-100"
                        />
                        <SearchOutlinedIcon className="mr-2" />
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-[#333333] hover:bg-[#121212] text-white md:p-4 p-2 rounded-md text-xs"
                    >
                        Create Module
                    </button>
                </section>


                {showCreateForm && (
                    <form
                        onSubmit={handleCreateModule}
                        className="fixed flex items-center justify-center w-full h-screen z-50 bg-black bg-opacity-50 "
                    >
                        <div className="absolute w-[70%] h-screen bg-white flex flex-col gap-4 p-6 border rounded-md">
                            <div className="w-full flex justify-between items-center">
                                <h3 className="text-2xl font-semibold text-red-900">Create Module</h3>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-4 py-2 rounded-md hover:bg-gray-300"
                                >
                                    <ClearIcon />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4 p-6">
                                <input
                                    type="text"
                                    placeholder="Module Name"
                                    value={newModule.name}
                                    onChange={(e) =>
                                        setNewModule({ ...newModule, name: e.target.value })
                                    }
                                    className="p-2 border rounded-md"
                                    required
                                />
                                <div className="flex flex-row items-center justify-between">
                                    <div className="w-fit flex flex-col space-y-4">
                                        <label className="flex items-center cursor-pointer rounded-lg border border-gray-300 px-4 py-2 shadow-sm hover:bg-gray-100">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-red-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 16l4 4m0 0l4-4m-4 4V4m13 16V4m0 0l-4 4m4-4l4 4"
                                                />
                                            </svg>
                                            <div className="flex flex-col gap-1">
                                                <span className="ml-2 text-sm font-medium text-gray-700">
                                                    Choose Achievement Image
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={handleAchievement_FileChange}
                                                className="hidden"
                                                accept="image/*"
                                                name="achievement_image"
                                            />
                                        </label>
                                        <span className="text-sm text-gray-500">{fileNameAchievement}</span>
                                    </div>
                                    <div className="w-fit flex flex-col space-y-4">
                                        <label htmlFor="difficulty_level" className="text-sm font-medium text-gray-700">
                                            Select Difficulty Level
                                        </label>
                                        <select
                                            id="difficulty_level"
                                            value={newModule.difficulty_level}
                                            onChange={(e) =>
                                                setNewModule({ ...newModule, difficulty_level: e.target.value })
                                            }
                                            className="p-2 border rounded-md"
                                            required
                                        >
                                            <option value="" disabled>Select Difficulty</option>
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Module Description"
                                    value={newModule.description}
                                    onChange={(e) =>
                                        setNewModule({ ...newModule, description: e.target.value })
                                    }
                                    className="p-2 border rounded-md"
                                    rows="4"
                                    required
                                ></textarea>
                                <div className="w-fit flex flex-col space-y-4">
                                    <label className="flex items-center cursor-pointer rounded-lg border border-gray-300 px-4 py-2 shadow-sm hover:bg-gray-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-red-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 16l4 4m0 0l4-4m-4 4V4m13 16V4m0 0l-4 4m4-4l4 4"
                                            />
                                        </svg>
                                        <div className="flex flex-col gap-1">
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Choose Background Image
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                            name="file"
                                        />
                                    </label>
                                    <span className="text-sm text-gray-500">{fileName}</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tags (comma separated)"
                                    value={newModule.tags}
                                    onChange={(e) =>
                                        setNewModule({ ...newModule, tags: e.target.value })
                                    }
                                    className="p-2 border rounded-md"
                                    required
                                />
                                {/* Difficulty Level Dropdown */}
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-red-900 hover:bg-red-700 text-white"
                                >
                                    Create Module
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Display filtered modules */}
                <MaxWidthWrapper className="w-fit m-auto flex flex-wrap flex-row gap-4">
                    {filteredModules?.length > 0 ? (
                        filteredModules.map((module, index) => (
                            <section
                                key={index}
                                className="h-72 flex flex-col justify-between lg:w-72 md:w-64 w-56 rounded-md border-[1px] bg-white overflow-hidden"
                            >
                                <div className={`relative flex w-full h-36 p-3 text-white ${!module.file_url && "bg-red-950"}`}>
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

                                <div className="w-full h-20 p-3 flex flex-row flex-wrap gap-2 overflow-hidden bg-white">
                                    {module.tags.map((tag, index) => (
                                        <p
                                            key={index}
                                            className="h-fit border-2 px-2 py-1 rounded-lg lg:text-[0.6rem] text-[0.45rem] tracking-wide"
                                        >
                                            {tag}
                                        </p>
                                    ))}
                                </div>
                                <section className="w-full h-12 p-3 mb-3 gap-x-6 flex justify-end items-center text-xs">
                                    <div className="flex flex-row gap-3">
                                        <button
                                            onClick={() => handleDeleteModule(module.id)}
                                            className="rounded-sm py-2 px-4 font-medium bg-red-700 hover:bg-red-800 text-white"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setEditModule(module);
                                            }}
                                            className="rounded-sm py-2 px-4 font-medium bg-[#333333] hover:bg-[#121212] text-white"
                                        >
                                            Edit
                                        </button>

                                        <Link
                                            to={`/modules/units/${module.id}`}
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

                </MaxWidthWrapper>
                {isEditing && editModule && (
                    <form
                        onSubmit={handleUpdateModule}
                        className="fixed flex items-center justify-center w-full h-screen z-50 bg-black bg-opacity-50 "
                    >
                        <div className="absolute w-[70%] h-screen bg-white flex flex-col gap-4 p-6 border rounded-md">
                            <div className="w-full flex  justify-between items-center">
                                <h3 className="text-2xl font-semibold text-red-900">Edit Module</h3>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded-md hover:bg-gray-300"
                                >
                                    <ClearIcon />
                                </button>
                            </div>
                            <div className="flex flex-col gap-4 p-6">
                                <input
                                    type="text"
                                    value={editModule.name}
                                    onChange={(e) =>
                                        setEditModule({ ...editModule, name: e.target.value })
                                    }
                                    className="p-2 border rounded-md"
                                    required
                                />
                                <div className="flex flex-row items-center justify-between">
                                    <div className="w-fit flex flex-col space-y-4">
                                        <label className="flex items-center cursor-pointer rounded-lg border border-gray-300 px-4 py-2 shadow-sm hover:bg-gray-100">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-red-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 16l4 4m0 0l4-4m-4 4V4m13 16V4m0 0l-4 4m4-4l4 4"
                                                />
                                            </svg>
                                            <div className="flex flex-col gap-1">
                                                <span className="ml-2 text-sm font-medium text-gray-700">
                                                    Choose Achievement Image
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={handleEditAchievementFileChange}
                                                className="hidden"
                                                accept="image/*"
                                                name="achievement_image"
                                            />
                                        </label>
                                        <span className="text-sm text-gray-500">{editAchievementFileName}</span>
                                    </div>
                                    <div className="w-fit flex flex-col space-y-4">
                                        <label htmlFor="difficulty_level" className="text-sm font-medium text-gray-700">
                                            Select Difficulty Level
                                        </label>
                                        <select
                                            id="difficulty_level"
                                            value={editModule.difficulty_level}
                                            onChange={(e) =>
                                                setEditModule({ ...editModule, difficulty_level: e.target.value })
                                            }
                                            className="p-2 border rounded-md"
                                            required
                                        >
                                            <option value="" disabled>Select Difficulty</option>
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea
                                    value={editModule.description}
                                    onChange={(e) =>
                                        setEditModule({ ...editModule, description: e.target.value })
                                    }
                                    className="p-2 border rounded-md"
                                    rows="4"
                                    required
                                ></textarea>
                                <div className="w-fit flex flex-col space-y-4">
                                    <label className="flex items-center cursor-pointer rounded-lg border border-gray-300 px-4 py-2 shadow-sm hover:bg-gray-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-red-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 16l4 4m0 0l4-4m-4 4V4m13 16V4m0 0l-4 4m4-4l4 4"
                                            />
                                        </svg>
                                        <div className="flex flex-col gap-1">
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Choose Background Image
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            onChange={handleEditFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                    <span className="text-sm text-gray-500">{editFileName}</span>
                                </div>

                                <input
                                    type="text"
                                    value={editModule.tags}
                                    onChange={(e) =>
                                        setEditModule({ ...editModule, tags: e.target.value })
                                    }
                                    className="p-2 border rounded-md"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-red-900 hover:bg-red-700 text-white "
                                >
                                    Update Module
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

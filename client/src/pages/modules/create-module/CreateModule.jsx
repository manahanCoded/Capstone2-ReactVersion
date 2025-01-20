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
    const [newModule, setNewModule] = useState({
        name: "",
        description: "",
        tags: "",
        created_by: ""
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

    useEffect(() => {
        async function handleModules() {
            try {
                const modulesData = await axios.get(
                    "http://localhost:5000/api/module/allModule-storage"
                );

                if (Array.isArray(modulesData.data.listall)) {
                    setModules(modulesData.data.listall);
                } else {
                    setModules([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        handleModules();
    }, []);

    const handleCreateModule = async (e) => {
        e.preventDefault();
        try {
            const { name, description, tags, created_by } = newModule;
            const res = await axios.post("http://localhost:5000/api/module/createModule", {
                name,
                description,
                tags: tags.split(",").map((tag) => tag.trim()),
                created_by,
            });

            if (res.status === 201) {
                alert("Module created successfully!");
                setShowCreateForm(false);
                setNewModule({ name: "", description: "", tags: "", created_by: newModule.created_by });
                setModules((prev) => [...prev, res.data.newModule]);
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.error || "Failed to create module.";
                alert(errorMessage);
            } else {
                alert("Failed to create module. Please refresh the page.");
            }
            console.error("Error creating module:", error);
        }
    };


    const handleUpdateModule = async (e) => {
        e.preventDefault();
        if (!editModule) return;

        try {

            const tagsArray = Array.isArray(editModule.tags)
                ? editModule.tags.join(", ") // If it's an array, join it into a string
                : editModule.tags; // If it's already a string, use it as is

            const res = await axios.put(`http://localhost:5000/api/module/updateModule/${editModule.id}`, {
                name: editModule.name,
                description: editModule.description,
                tags: tagsArray.split(",").map((tag) => tag.trim()),
            });

            if (res.status === 200) {
                alert("Module updated successfully!");
                setModules((prev) =>
                    prev.map((module) => (module.id === editModule.id ? res.data.updatedModule : module))
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
                <section className="sticky top-14 h-20 w-full px-8 py-2 flex flex-row justify-between items-center lg:pr-16 gap-6 text-xs border-b-[1px] bg-white">
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
                        className="fixed flex items-center justify-center w-full h-screen bg-black bg-opacity-50 "
                    >
                        <div className="absolute w-[70%] h-[85%] top-3 bg-white flex flex-col gap-4 p-6 border rounded-md">
                            <div className="w-full flex  justify-between items-center">
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
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-red-900 hover:bg-red-700 text-white "
                                >
                                    Create Module
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Display filtered modules */}
                <MaxWidthWrapper className="w-full flex flex-wrap gap-4 justify-center">
                    {Array.isArray(filteredModules) && filteredModules.length > 0 ? (
                        filteredModules.map((module, index) => (
                            <section
                                key={index}
                                className="h-72 flex flex-col justify-between  lg:w-72 md:w-64 w-56 rounded-md border-[1px] bg-white overflow-hidden"
                            >
                                <div className="w-full h-36 p-3 bg-red-900 text-white">
                                    <h2 className="text-lg font-medium line-clamp-3">
                                        {module.name}
                                    </h2>
                                </div>
                                <div className="w-full h-20 p-3 flex flex-row flex-wrap gap-2 overflow-hidden">
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
                        className="fixed flex items-center justify-center w-full h-screen bg-black bg-opacity-50 "
                    >
                        <div className="absolute w-[70%] h-[85%] top-3 bg-white flex flex-col gap-4 p-6 border rounded-md">
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
                                <textarea
                                    value={editModule.description}
                                    onChange={(e) =>
                                        setEditModule({ ...editModule, description: e.target.value })
                                    }
                                    className="p-2 border rounded-md"
                                    rows="4"
                                    required
                                ></textarea>
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

import React, { useEffect, useState } from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import { CitySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import "react-quill-new/dist/quill.snow.css";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SignpostOutlinedIcon from "@mui/icons-material/SignpostOutlined";
import PersonIcon from "@mui/icons-material/Person";

export default function CreateJobPage() {
    const [isClient, setIsClient] = useState(false);
    const [stateid, setStateId] = useState(0);
    const [typeForm, setTypeForm] = useState("job");
    const [information, setInformation] = useState({
        id: 0,
        publisher: "",
        name: "",
        phone: 0,
        email: "",
        applicants: 0,
        title: "",
        remote: "",
        experience: "",
        jobtype: "",
        state: "",
        city: "",
        street: "",
        salary: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
    });

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        publisher: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
    });

    const navigate = useNavigate();

    const onDescription = (value) => {
        setInformation({ ...information, description: value });
    };

    const onAnnouncementDescription = (value) => {
        setNewAnnouncement({ ...newAnnouncement, description: value });
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

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

                if (data.role === "client") {
                    alert("Unauthorized access!");
                    navigate("/modules");
                }

                setInformation((prev) => ({
                    ...prev,
                    publisher: data.email,
                }));
                setNewAnnouncement((prev) => ({
                    ...prev,
                    publisher: data.email,
                }));
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

    async function postJob(e) {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/job/create",
                information,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 201) {
                navigate("/forum");
            } else {
                alert("Failed to create job.");
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.error("Error creating job:", err.response.data);
                alert("Error creating job: " + (err.response.data.message || "Unknown error"));
            } else {
                alert("Error creating job.");
                console.error(err);
            }
        }
    }

    async function postAnnouncement(e) {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/announcement/addAnnouncements",
                newAnnouncement,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 201) {
                navigate("/forum");
            } else {
                alert("Failed to create Announcement.");
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.error("Error creating Announcement:", err.response.data);
                alert("Error creating Announcement: " + (err.response.data.message || "Unknown error"));
            } else {
                alert("Error creating Announcement.");
                console.error(err);
            }
        }
    }

    return (
        <div className="mt-14  justify-center text-sm">
            <form onSubmit={postJob} className="w-full flex flex-col border-l-2">
                <section className="">
                    <MaxWidthWrapper className="h-16 flex justify-between items-center border-b-2">
                        <div className="h-16  flex flex-row">
                            <div
                                className={
                                    typeForm === "job"
                                        ? "px-4 flex items-center cursor-pointer text-white bg-red-900"
                                        : "px-4 flex items-center cursor-pointer"
                                }
                                onClick={() => setTypeForm("job")}
                            >
                                <p>Create Job</p>
                            </div>
                            <div
                                className={
                                    typeForm === "announcement"
                                        ? "px-4 flex items-center cursor-pointer text-white bg-red-900 "
                                        : "px-4 flex items-center cursor-pointer"
                                }
                                onClick={() => setTypeForm("announcement")}
                            >
                                <p>Announcement</p>
                            </div>
                        </div>
                        <Link
                            to="/forum"
                            className="flex gap-1 items-center p-2 rounded-lg border-2 border-red-900 text-red-900 hover:bg-red-900 hover:border-red-900 hover:text-white"
                        >
                            <ExitToAppIcon />
                            Discard
                        </Link>
                    </MaxWidthWrapper>
                </section>

                <section className={typeForm === "job" ? "block py-14 " : "hidden"}>
                    <MaxWidthWrapper>
                        <section className="flex flex-col gap-4 md:w-3/4 p-4 md:px-8  m-auto rounded-lg bg-gray-100 ">
                            <section className="flex mb-2">
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-base">Contact Person</h6>
                                    <div className="flex flex-row items-center gap-2">
                                        <PersonIcon className="min-h-32 min-w-32 bg-white" />
                                        <section className="w-full flex flex-col gap-2">
                                            <div className="pl-2 border-[1px] rounded-md border-slate-300 bg-white">
                                                <PersonIcon />
                                                <input
                                                    type="text"
                                                    required
                                                    className="p-2 rounded-md"
                                                    placeholder="Name"
                                                    onChange={(e) => {
                                                        setInformation({
                                                            ...information,
                                                            name: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="pl-2 border-[1px] rounded-md border-slate-300 bg-white">
                                                <LocalPhoneIcon />
                                                <input
                                                    type="number"
                                                    required
                                                    className="p-2 rounded-md"
                                                    placeholder="Phone"
                                                    onChange={(
                                                        e
                                                    ) => {
                                                        const value = e.target.value;
                                                        setInformation({
                                                            ...information,
                                                            phone: parseInt(value),
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="pl-2 border-[1px] rounded-md border-slate-300 bg-white">
                                                <EmailIcon />
                                                <input
                                                    type="email"
                                                    required
                                                    className="p-2 rounded-md"
                                                    placeholder="Email"
                                                    onChange={(e) => {
                                                        setInformation({
                                                            ...information,
                                                            email: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </section>

                            <section className="flex flex-col gap-2 mb-2">
                                <label className="text-xl">Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Job Title"
                                    className="px-4 py-2 rounded-md border-[1px] border-slate-300"
                                    onChange={(e) => {
                                        setInformation({ ...information, title: e.target.value });
                                    }}
                                />
                            </section>

                            <section className="flex flex-row gap-4 justify-between mb-2">
                                {/* Full-time options */}
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-base">Job Type</h6>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="jobType"
                                                className="hidden peer"
                                                value="Internship"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        jobtype: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300  peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Internship
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="jobType"
                                                className="hidden peer"
                                                value="Freelance"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        jobtype: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300  peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Freelance
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="jobType"
                                                className="hidden peer"
                                                value="Contract"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        jobtype: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300  peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Contract
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="jobType"
                                                className="hidden peer"
                                                value="Project"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        jobtype: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300  peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Project
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="jobType"
                                                className="hidden peer"
                                                value="Part-time"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        jobtype: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Part-time
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="jobType"
                                                className="hidden peer"
                                                value="Full-time"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        jobtype: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Full-time
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Remote options */}
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-base">Remote?</h6>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="remote"
                                                className="hidden peer"
                                                value="On-site"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        remote: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                On-site
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="remote"
                                                className="hidden peer"
                                                value="Hybrid-remote"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        remote: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Hybrid-remote
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="remote"
                                                className="hidden peer"
                                                value="Full remote"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        remote: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Full remote
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Experience options */}
                                <div className="flex flex-col gap-2">
                                    <h6 className="text-base">Experience</h6>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="experience"
                                                className="hidden peer"
                                                value="Entry-Level"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        experience: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Entry-Level
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="experience"
                                                className="hidden peer"
                                                value="Mid-Level"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        experience: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Mid-Level
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="experience"
                                                className="hidden peer"
                                                value="Senior-Level"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        experience: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Senior-Level
                                            </span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="experience"
                                                className="hidden peer"
                                                value="Managerial"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        experience: e.target.value,
                                                    });
                                                }}
                                            />
                                            <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white-600"></div>
                                            <span className="ml-2 peer-checked:text-red-600">
                                                Managerial
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Salary */}
                                <div className="w-1/3 flex flex-col gap-2">
                                    <label>Salary</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder=""
                                        className={`px-4 py-2 rounded-md border-[1px] border-slate-300 ${information.salary === "Unpaid"
                                            ? "text-gray-400"
                                            : "text-black"
                                            }`}
                                        value={information.salary || "Unpaid"}
                                        onChange={(e) => {
                                            const numericValue = e.target.value.replace(
                                                /[^0-9]/g,
                                                ""
                                            );

                                            if (numericValue.length > 11) return;

                                            const formattedValue = numericValue
                                                ? `₱${Number(numericValue).toLocaleString("en-PH")}`
                                                : "";

                                            setInformation({
                                                ...information,
                                                salary: formattedValue,
                                            });
                                        }}
                                        onFocus={() => {
                                            if (information.salary === "Unpaid") {
                                                setInformation({ ...information, salary: "" });
                                            }
                                        }}
                                    />
                                    <p className="text-xs">
                                        <span className="text-red-800 text-lg">*</span> Immediately
                                        input Numeric Values (Leave Blank if Unpaid).{" "}
                                    </p>
                                </div>
                            </section>

                            <section className="flex flex-col gap-2 mb-2">
                                <h6 className="text-base">Location</h6>
                                <section className="flex md:flex-row flex-col justify-between gap-4">
                                    <div className="w-full">
                                        <h6>State</h6>
                                        <StateSelect
                                            countryid={174}
                                            value={information.state}
                                            onChange={(e) => {
                                                setStateId(e.id);
                                                setInformation({
                                                    ...information,
                                                    state: e.name.toString(),
                                                });
                                            }}
                                            placeHolder="Select State"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <h6>City</h6>
                                        <CitySelect
                                            countryid={174}
                                            stateid={stateid}
                                            value={information.city}

                                            onChange={(e) => {
                                                setInformation({
                                                    ...information,
                                                    city: e.name.toString(),
                                                });
                                            }}
                                            placeHolder="Select City"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <h6>Street</h6>
                                        <div className="py-1 px-1.5 border-[1px] flex justify-between items-center rounded-md border-slate-300">
                                            <input
                                                type="text"
                                                required
                                                value={information.street}
                                                className="w-full p-1.5 rounded-sm border-[1px] border-slate-300 bg-white"
                                                placeholder="Specific Street"
                                                onChange={(e) => {
                                                    setInformation({
                                                        ...information,
                                                        street: e.target.value,
                                                    });
                                                }}
                                            />
                                            <SignpostOutlinedIcon />
                                        </div>
                                    </div>
                                </section>
                                <p className="text-xs">
                                    <span className="text-red-800 text-lg">*</span>Please input
                                    the location by selection (No auto fills by google).
                                </p>
                            </section>

                            <section className="flex flex-col gap-2">
                                {isClient && (
                                    <div className="mb-4">
                                        <label className="block text-base text-gray-700 mb-2">
                                            Job Description
                                        </label>
                                        <EditorToolbar toolbarId="t1" />
                                        <ReactQuill
                                            theme="snow"
                                            value={information.description}
                                            onChange={onDescription}
                                            placeholder="Write something awesome..."
                                            modules={modules("t1")}
                                            formats={formats}
                                            className="bg-white border rounded"
                                        />
                                    </div>
                                )}
                            </section>
                            <input
                                type="submit"
                                required
                                className="px-4 py-2 rounded-lg border-2 bg-red-900 cursor-pointer text-white"
                            />
                        </section>
                    </MaxWidthWrapper>
                </section>
            </form>
            <form onSubmit={postAnnouncement} className="w-full flex flex-col border-l-2">
                <section className={typeForm === "announcement" ? "block py-14 " : "hidden"}>
                    <MaxWidthWrapper>
                        <section className="flex flex-col gap-4 md:w-3/4 p-4 md:px-8  m-auto rounded-lg bg-gray-100 ">
                            {isClient && (
                                <section className="flex flex-col gap-2">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newAnnouncement.title}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Enter the title"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <EditorToolbar toolbarId="t2" />
                                        <ReactQuill
                                            theme="snow"
                                            value={newAnnouncement.description}
                                            onChange={onAnnouncementDescription}
                                            placeholder="Write something..."
                                            modules={modules("t2")}
                                            formats={formats}
                                            className="bg-white border rounded"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="submit"
                                            className="bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </section>
                            )}
                        </section>
                    </MaxWidthWrapper>
                </section>
            </form>
        </div>
    );
}
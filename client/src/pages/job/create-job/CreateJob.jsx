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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { Alert, Snackbar } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CreateJobPage() {
    const [isClient, setIsClient] = useState(false);
    const [stateid, setStateId] = useState(0);
    const [typeForm, setTypeForm] = useState("job");
    const [fileName, setFileName] = useState("No file selected");
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
        moreinfo: "",
        date: new Date().toISOString().split("T")[0],
        selectedFile: null
    });

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        publisher: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
    });

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({
        title: "",
        message: "",
        action: null
    });

      const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
      });

    const navigate = useNavigate();

    const onDescription = (value) => {
        setInformation({ ...information, description: value });
    };

    const onMoreInfo = (value) => {
        setInformation({ ...information, moreinfo: value });
    };

    const onAnnouncementDescription = (value) => {
        setNewAnnouncement({ ...newAnnouncement, description: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setInformation({ ...information, selectedFile: file });
        setFileName(file ? file.name : "No file selected");
    };

    const handleConfirmDialogOpen = (title, message, action) => {
        setDialogContent({
            title,
            message,
            action
        });
        setOpenConfirmDialog(true);
    };

    const handleConfirmDialogClose = () => {
        setOpenConfirmDialog(false);
    };

    const handleConfirmAction = () => {
        dialogContent.action();
        setOpenConfirmDialog(false);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

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

                if (data.role === "client") {
                    navigate("/jobs");
                    return;
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
                console.error("An error occurred:", err);
            }
        }

        checkUser();
    }, [navigate, setInformation, setNewAnnouncement]);

    
  const validateForm = () => {
    if (!information.title.trim()) {
      setSnackbar({
        open: true,
        message: "Job title is required",
        severity: "error"
      });
      return false;
    }
    if (!information.name.trim()) {
      setSnackbar({
        open: true,
        message: "Contact person name is required",
        severity: "error"
      });
      return false;
    }
    if (!information.email.trim()) {
      setSnackbar({
        open: true,
        message: "Email is required",
        severity: "error"
      });
      return false;
    }
    if (!information.phone.trim() || information.phone.length < 11) {
      setSnackbar({
        open: true,
        message: "Valid phone number is required (at least 11 digits)",
        severity: "error"
      });
      return false;
    }
    if (!information.jobtype.trim()) {
      setSnackbar({
        open: true,
        message: "Job type is required",
        severity: "error"
      });
      return false;
    }
    if (!information.remote.trim()) {
      setSnackbar({
        open: true,
        message: "Remote option is required",
        severity: "error"
      });
      return false;
    }
    if (!information.street.trim()) {
      setSnackbar({
        open: true,
        message: "Street  is required",
        severity: "error"
      });
      return false;
    }
    if (!information.experience) {
      setSnackbar({
        open: true,
        message: "Experience level is required",
        severity: "error"
      });
      return false;
    }
    if (!information.state || !information.city || !information.street) {
      setSnackbar({
        open: true,
        message: "Complete location information is required",
        severity: "error"
      });
      return false;
    }
    if (!information.description.trim() || information.description.length < 50) {
      setSnackbar({
        open: true,
        message: "Description must be at least 50 characters",
        severity: "error"
      });
      return false;
    }
    
    return true;
  };

  const validateAnnouncement= () => {
    if (!newAnnouncement.title.trim()) {
      setSnackbar({
        open: true,
        message: "Announcement title is required",
        severity: "error"
      });
      return false;
    }
    if (!newAnnouncement.description.trim() || newAnnouncement.description.length < 20) {
        setSnackbar({
          open: true,
          message: "Announcement Description must be at least 50 characters",
          severity: "error"
        });
        return false;
      }
    return true;
  };


    async function postJob(e) {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(information).forEach(([key, value]) => {
            if (key === "selectedFile" && value) {
                formData.append("file", value);
            } else {
                formData.append(key, value);
            }
        });

        try {
            const res = await axios.post(`${API_URL}/api/job/create`, formData);
            if (res.status === 201) {
                setSnackbar({
                    open: true,
                    message: "Job created successfully.",
                    severity: "success"
                  });
                  setTimeout(() => navigate("/jobs"), 1500)
            } else {
                setSnackbar({
                    open: true,
                    message: "Failed to create job",
                    severity: "error"
                  });
            }
        } catch (err) {
            console.error("Error uploading job:", err);
            setSnackbar({
                open: true,
                message: "An error occurred while creating the job.",
                severity: "error"
              });
        }
    }

    async function postAnnouncement(e) {
        e.preventDefault()
        try {
            const res = await axios.post(
                `${API_URL}/api/announcement/addAnnouncements`,
                newAnnouncement,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
          
            if (res.status === 201) {
                setSnackbar({
                    open: true,
                    message: "Announcement created successfully",
                    severity: "success"
                });
                setTimeout(() => navigate("/jobs"), 1500)
            } else {
                setSnackbar({
                    open: true,
                    message: "Failed to create Announcement.",
                    severity: "error"
                });
            }
            
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                console.error("Error creating Announcement:", err.response.data);
                setSnackbar({
                    open: true,
                    message: "Error creating Announcement: " + (err.response.data.message || "Unknown error"),
                    severity: "error"
                  });
            } else {
                setSnackbar({
                    open: true,
                    message: "Error creating Announcement.",
                    severity: "error"
                  });
                console.error(err);
            }
        }
    }

    const handleJobSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        handleConfirmDialogOpen(
            "Confirm Job Creation",
            "Are you sure you want to create this job posting?",
            () => postJob(e)
        );
    };

    const handleAnnouncementSubmit = (e) => {
        e.preventDefault();
        if(!validateAnnouncement()) return false
        handleConfirmDialogOpen(
            "Confirm Announcement Creation",
            "Are you sure you want to create this announcement?",
            () => postAnnouncement(e)
        );
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
      };

    return (
        <div className="mt-14 justify-center text-sm">
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                      {snackbar.message}
                    </Alert>
                  </Snackbar>
            

            {/* Confirmation Dialog */}

            <Dialog
                open={openConfirmDialog}
                onClose={handleConfirmDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="alert-dialog-title">{dialogContent.title}</DialogTitle>
                <DialogContent>
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            Are you sure you want to create this {typeForm === "job" ? "job" : "announcement"}?
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="font-semibold text-blue-800">
                                Title: "{typeForm === "job" ? information.title : newAnnouncement.title}"
                            </p>
                            <p className="text-blue-600 mt-2">
                                This will create a new learning unit that will be immediately visible to users.
                            </p>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={handleConfirmDialogClose}
                        variant="outlined"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >Cancel</Button>
                    <Button onClick={handleConfirmAction}
                        variant="contained"
                        color="primary"
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Confirm Creation
                    </Button>
                </DialogActions>
            </Dialog>

            <form onSubmit={handleJobSubmit} className="w-full flex flex-col border-l-2">
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
                            to="/jobs"
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
                            <section className="flex flex-row justify-between mb-2">
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
                                                    onChange={(e) => {
                                                        const onlyNums = e.target.value.replace(/\D/g, "");
                                                        setInformation({
                                                            ...information,
                                                            phone: onlyNums,
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
                                <div className="flex flex-col items-center space-y-4">
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
                                        />
                                    </label>
                                    <span className="text-sm text-gray-500">{fileName}</span>
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
                                        <label className="block text-base text-gray-700 mb-2 mt-4">
                                            Short Job Description
                                        </label>
                                        <div className="bg-white">
                                            <EditorToolbar toolbarId="t1" />
                                            <ReactQuill
                                                theme="snow"
                                                value={information.description}
                                                required
                                                onChange={onDescription}
                                                placeholder="Write something awesome..."
                                                modules={modules("t1")}
                                                formats={formats}
                                                className="bg-white border rounded  h-[55vh] overflow-y-auto"
                                            />
                                        </div>
                                        <label className="block text-base text-gray-700 mb-2 mt-4">
                                            More Information
                                        </label>
                                        <div className="bg-white ">
                                            <EditorToolbar toolbarId="t2" />
                                            <ReactQuill
                                                theme="snow"
                                                value={information.moreinfo}
                                                required
                                                onChange={onMoreInfo}
                                                placeholder="Write something awesome..."
                                                modules={modules("t2")}
                                                formats={formats}
                                                className="bg-white border rounded  h-[55vh] overflow-y-auto"
                                            />
                                        </div>
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

            <form onSubmit={handleAnnouncementSubmit} className="w-full flex flex-col border-l-2 text-base">
                <section className={typeForm === "announcement" ? "block py-14 " : "hidden"}>
                    <MaxWidthWrapper>
                        <section className="flex flex-col gap-4 md:w-3/4 p-4 md:px-8  m-auto rounded-lg bg-gray-100 ">
                            {isClient && (
                                <section className="flex flex-col gap-2">
                                    <label className=" text-gray-700 ">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mb-4">
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
                                    <label className=" text-gray-700 2">Announcement details</label>
                                    <div className="mb-4 bg-white">
                                        <EditorToolbar toolbarId="t3" />
                                        <ReactQuill
                                            theme="snow"
                                            value={newAnnouncement.description}
                                            onChange={onAnnouncementDescription}
                                            placeholder="Write something..."
                                            modules={modules("t3")}
                                            formats={formats}
                                            className="bg-white border rounded  h-[70vh] overflow-y-auto"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="submit"
                                            className="bg-red-900 text-white text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
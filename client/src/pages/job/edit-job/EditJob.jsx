import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "react-country-state-city/dist/react-country-state-city.css";
import { CitySelect, StateSelect } from "react-country-state-city";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SignpostOutlinedIcon from "@mui/icons-material/SignpostOutlined";
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditJobPage() {
  const navigate = useNavigate();
  const { jobEditID } = useParams();

  const [specificJob, setSpecificJob] = useState(null);
  const [information, setInformation] = useState({
    name: "",
    phone: "",
    email: "",
    title: "",
    jobtype: "",
    remote: "",
    experience: "",
    salary: "",
    state: "",
    city: "",
    street: "",
    description: "",
    moreinfo: "",
    date: new Date().toISOString().split("T")[0],
    fileName: "",
    fileBuffer: null,
    fileMimeType: "",
  });

  const [isClient, setIsClient] = useState(false);
  const [stateid, setStateid] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Check user authentication and role
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
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/user/login");
      }
    }
    checkUser();
  }, [navigate]);

  // Fetch job data
  useEffect(() => {
    if (jobEditID) {
      async function fetchJobData() {
        try {
          const response = await axios.get(
            `${API_URL}/api/job/specific-job/${jobEditID}`
          );
          setSpecificJob(response.data);
        } catch (error) {
          console.error("Error fetching specific job:", error);
          setSnackbar({
            open: true,
            message: "Failed to load job data",
            severity: "error"
          });
        }
      }
      fetchJobData();
    }
  }, [jobEditID]);

  // Set form data when job data is loaded
  useEffect(() => {
    if (specificJob) {
      setIsClient(true);
      setInformation({
        name: specificJob.name || "",
        phone: specificJob.phone ? specificJob.phone.toString() : "",
        email: specificJob.email || "",
        title: specificJob.title || "",
        jobtype: specificJob.jobtype || "",
        remote: specificJob.remote || "",
        experience: specificJob.experience || "",
        salary: specificJob.salary || "",
        state: specificJob.state || "",
        city: specificJob.city || "",
        street: specificJob.street || "",
        description: specificJob.description || "",
        moreinfo: specificJob.moreinfo || "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [specificJob]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInformation((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInformation((prev) => ({
          ...prev,
          fileName: file.name,
          fileBuffer: reader.result.split(",")[1],
          fileMimeType: file.type,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Form validation
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
    if (!information.jobtype) {
      setSnackbar({
        open: true,
        message: "Job type is required",
        severity: "error"
      });
      return false;
    }
    if (!information.remote) {
      setSnackbar({
        open: true,
        message: "Remote option is required",
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
    if (!information.description || information.description.length < 50) {
      setSnackbar({
        open: true,
        message: "Description must be at least 50 characters",
        severity: "error"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setOpenSaveDialog(true);
  };

  // Confirm and execute job edit
  const confirmEdit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      Object.entries(information).forEach(([key, value]) => {
        if (key === "fileBuffer" && information.fileBuffer) {
          const blob = new Blob([new Uint8Array(atob(value).split('').map(c => c.charCodeAt(0)))], {
            type: information.fileMimeType,
          });
          formData.append("file", blob, information.fileName);
        } else {
          formData.append(key, value);
        }
      });

      const response = await axios.put(
        `${API_URL}/api/job/upDatejob/${jobEditID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSnackbar({
        open: true,
        message: "Job updated successfully!",
        severity: "success"
      });
      setTimeout(() => navigate("/jobs"), 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error updating job",
        severity: "error"
      });
      console.error("Error updating job:", error);
    } finally {
      setIsLoading(false);
      setOpenSaveDialog(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  // Confirm and execute job deletion
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/api/job/delete/${jobEditID}`);
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Job deleted successfully!",
          severity: "success"
        });
        setTimeout(() => navigate("/jobs"), 1500);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete the job",
        severity: "error"
      });
      console.error("Error deleting job:", error);
    } finally {
      setIsLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="mt-14 flex flex-row justify-center text-sm">
      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col border-l-2">
        <section className="">
          <MaxWidthWrapper className="h-16 flex justify-between items-center border-b-2">
            <div className="h-16 flex flex-row">
              <div className="px-4 flex items-center cursor-pointer text-white bg-red-900">
                <p>Edit Job</p>
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

        <section className="block py-14">
          <MaxWidthWrapper>
            <section className="flex flex-col gap-4 md:w-3/4 p-4 md:px-8 m-auto rounded-lg bg-gray-100 ">
              {/* Contact Person Section */}
              <section className="flex justify-between md:flex-row flex-col gap-4 mb-2">
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
                          name="name"
                          className="p-2 rounded-md"
                          placeholder="Name"
                          value={information.name}
                          onChange={onInputChange}
                        />
                      </div>

                      <div className="pl-2 border-[1px] rounded-md border-slate-300 bg-white">
                        <LocalPhoneIcon />
                        <input
                          type="text"
                          value={information.phone}
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/\D/g, ""); 
                            setInformation({
                              ...information,
                              phone: onlyNums,
                            });
                          }}
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="pl-2 border-[1px] rounded-md border-slate-300 bg-white">
                        <EmailIcon />
                        <input
                          type="email"
                          required
                          className="p-2 rounded-md"
                          placeholder="Email"
                          value={information.email}
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
                <div className="h-fit flex flex-row items-center gap-10">
                  <div className="flex flex-col items-center gap-x-4">
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
                          Edit Background Image
                        </span>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                    <span className="text-sm text-gray-500">{information.fileName}</span>
                  </div>
                  <div
                    className="h-14 w-20 flex rounded-sm text-sm items-center justify-center bg-red-900 text-white cursor-pointer hover:bg-red-800"
                    onClick={handleDeleteClick}
                  >
                    <p>Delete</p>
                  </div>
                </div>
              </section>

              {/* Job Title Section */}
              <section className="flex flex-col gap-2 mb-2">
                <label className="text-xl">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Job Title"
                  value={information.title}
                  className="px-4 py-2 rounded-md border-[1px] border-slate-300"
                  onChange={(e) => {
                    setInformation({ ...information, title: e.target.value });
                  }}
                />
              </section>

              {/* Job Details Section */}
              <section className="flex flex-row gap-4 justify-between mb-2">
                {/* Job Type Options */}
                <div className="flex flex-col gap-2">
                  <h6 className="text-base">Job Type</h6>
                  <div className="flex flex-col gap-2">
                    {["Internship", "Freelance", "Contract", "Project", "Part-time", "Full-time"].map((type) => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="jobType"
                          className="hidden peer"
                          value={type}
                          checked={information.jobtype === type}
                          onChange={(e) => {
                            setInformation({
                              ...information,
                              jobtype: e.target.value,
                            });
                          }}
                        />
                        <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white"></div>
                        <span
                          className={`ml-2 ${information.jobtype === type ? "text-red-600" : "text-gray-700"} peer-checked:text-red-600`}
                        >
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Remote Options */}
                <div className="flex flex-col gap-2">
                  <h6 className="text-base">Remote?</h6>
                  <div className="flex flex-col gap-2">
                    {["On-site", "Hybrid-remote", "Full remote"].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="remote"
                          className="hidden peer"
                          value={option}
                          checked={information.remote === option}
                          onChange={(e) => {
                            setInformation({
                              ...information,
                              remote: e.target.value,
                            });
                          }}
                        />
                        <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white"></div>
                        <span
                          className={`ml-2 ${information.remote === option ? "text-red-600" : "text-gray-700"} peer-checked:text-red-600`}
                        >
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Options */}
                <div className="flex flex-col gap-2">
                  <h6 className="text-base">Experience</h6>
                  <div className="flex flex-col gap-2">
                    {["Entry-Level", "Mid-Level", "Senior-Level", "Managerial"].map((level) => (
                      <label key={level} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="experience"
                          className="hidden peer"
                          value={level}
                          checked={information.experience === level}
                          onChange={(e) => {
                            setInformation({
                              ...information,
                              experience: e.target.value,
                            });
                          }}
                        />
                        <div className="w-4 h-4 rounded-full border-4 border-gray-300 peer-checked:border-red-600 peer-checked:bg-white"></div>
                        <span
                          className={`ml-2 ${information.experience === level ? "text-red-600" : "text-gray-700"} peer-checked:text-red-600`}
                        >
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Input */}
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

              {/* Location Section */}
              <section className="flex flex-col gap-2 mb-2">
                <h6 className="text-base">Location</h6>
                <section className="flex md:flex-row flex-col justify-between gap-4">
                  <div className="w-full">
                    <h6>State</h6>
                    <StateSelect
                      countryid={174}
                      value={information.state}
                      onChange={(e) => {
                        setStateid(e.id);
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

              {/* Description Editors */}
              <section className="flex flex-col gap-2">
                {isClient && (
                  <div className="mb-4">
                    <label className="block text-base text-gray-700 mb-2 mt-4">
                      Short Job Description
                    </label>
                    <div className="bg-white ">
                      <EditorToolbar toolbarId="t1" />
                    </div>
                    <ReactQuill
                      theme="snow"
                      value={information.description}
                      modules={modules("t1")}
                      onChange={(value) => setInformation({ ...information, description: value })}
                      formats={formats}
                      placeholder="Write something..."
                      className="bg-white border rounded h-[55vh] overflow-y-auto"
                    />
                    <label className="block text-base text-gray-700 mb-2 mt-4">
                      More Information
                    </label>
                    <div className="bg-white ">
                      <EditorToolbar toolbarId="t2" />
                    </div>
                    <ReactQuill
                      theme="snow"
                      value={information.moreinfo}
                      modules={modules("t2")}
                      onChange={(value) => setInformation({ ...information, moreinfo: value })}
                      formats={formats}
                      placeholder="Write something..."
                      className="bg-white border rounded h-[55vh] overflow-y-auto"
                    />
                  </div>
                )}
              </section>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg border-2 bg-red-900 cursor-pointer text-white hover:bg-red-800"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </section>
          </MaxWidthWrapper>
        </section>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to permanently delete this job posting?
            </p>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">
                "{information.title}"
              </p>
              <p className="text-red-600 mt-2">
                Warning: This action cannot be undone and will permanently remove all job data.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Confirmation Dialog */}
      <Dialog
        open={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="text-xl font-bold">Confirm Changes</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to save these changes to the job posting?
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-800">
                "{information.title}"
              </p>
              <p className="text-blue-600 mt-2">
                All changes will be immediately visible to applicants.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setOpenSaveDialog(false)}
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmEdit}
            variant="contained"
            color="primary"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? "Saving..." : "Confirm Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
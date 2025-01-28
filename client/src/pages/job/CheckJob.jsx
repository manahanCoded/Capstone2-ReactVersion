import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Link } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from '@mui/icons-material/Close';
import "quill/dist/quill.snow.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function CheckJobPage() {
  const { jobsID } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [job, setJob] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [userApplication, setUserApplication] = useState({
    name: "",
    date: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(new Date()),
    application: ""
  });

  useEffect(() => {
    async function checkUser() {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        navigate("/user/login");
      }
      const data = await res.json();
      setUser(data);
    }
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const fetchJobData = async () => {
      const res = await fetch("http://localhost:5000/api/job/display");
      if (!res.ok) {
        throw new Error("Failed to fetch jobs data");
      }

      const data = await res.json();
      const jobId = jobsID ? parseInt(jobsID) : null;
      const foundJob = jobId ? data.find((job) => job.id === jobId) : null;
      setJob(foundJob || null);
    };

    fetchJobData();
  }, [jobsID]);

  const [typeForm, setTypeForm] = useState("details");
  const [openApply, setOpenApply] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setUploadStatus('Please select a resume to upload.');
      return;
    }
  
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a PDF, DOC, DOCX, PNG, or JPG file.');
      setUploadStatus('Invalid file type.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
  
    if (job?.id) {
      formData.append('jobId', job.id.toString());
    }
    if (user?.email) {
      formData.append('email', user.email);
    }
    if (userApplication?.date) {
      formData.append('date', userApplication.date);
    }
    if (userApplication?.application) {
      formData.append('application', userApplication.application);
    }
    if (userApplication?.name) {
      formData.append('name', userApplication.name);
    }
  

    try {
      const response = await fetch('http://localhost:5000/api/job/upload-appointment', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        setUploadStatus('File uploaded successfully!');
      } else {
        const errorMessage = await response.text();
        alert('Upload failed: ' + errorMessage);
        setUploadStatus(`File upload failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('An error occurred during the upload.');
    }
  };
  
  return (
    <div className="mt-14 text-sm">
      <form className={openApply ? "fixed h-screen inset-0 z-10 backdrop-blur-sm bg-black bg-opacity-50" : "hidden"}>
        <div className="h-full flex justify-center items-center file-uploader">
          <div className="mt-14 h-5/6 lg:w-1/2 md:w-5/6 w-full flex flex-col py-4 gap-2 rounded-lg bg-white">
            <div className="py-1 px-3 flex justify-between items-center">
              <h2 className="text-red-900 md:text-lg font-bold">Upload Application Letter</h2>
              <button className="hover:bg-red-400" onClick={() => setOpenApply(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="p-3 flex flex-row justify-between items-center border-y-[1px]">
              <div className="flex items-center gap-2">
                <AccountCircleIcon fontSize="large" />
                <input
                  type="text"
                  placeholder="Full name"
                  className="border-[1px] rounded-md p-3"
                  value={userApplication.name}
                  onChange={(e) => {
                    setUserApplication({ ...userApplication, name: e.target.value });
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                }).format(new Date())}
              </div>
            </div>
            <div className="h-full flex flex-col justify-between gap-2">
              <div className="h-full p-3 border-b-[1px]">
                <textarea
                  className="p-3 h-full w-full border-[1px]"
                  required
                  placeholder="Write an application letter..."
                  value={userApplication.application}
                  onChange={(e) => {
                    setUserApplication({ ...userApplication, application: e.target.value });
                  }}
                ></textarea>
              </div>
              <div className="flex flex-col gap-4 px-3">
                <p className="font-semibold">Resume:</p>
                <input required type="file" className="w-fit" onChange={handleFileChange} />
                <button className="self-end w-28 rounded-md p-2 bg-red-900 text-white" onClick={handleFileUpload}>
                  Upload
                </button>
                {uploadStatus && <p>{uploadStatus}</p>}
              </div>
            </div>
          </div>
        </div>
      </form>

      <section className="border-b-2 w-full">
        <MaxWidthWrapper className="md:w-2/3 h-16 flex justify-between items-center">
          <div className="h-16 flex flex-row">
            <div
              className={typeForm === "details" ? "px-4 flex items-center cursor-pointer text-white bg-red-900" : "px-4 flex items-center cursor-pointer"}
              onClick={() => setTypeForm("details")}
            >
              <p>Details</p>
            </div>
          </div>
          <Link
            to="/jobs"
            className="flex gap-1 items-center p-2 rounded-lg border-2 border-red-900 text-red-900 hover:bg-red-900 hover:border-red-900 hover:text-white"
          >
            <ExitToAppIcon />
            Back
          </Link>
        </MaxWidthWrapper>
      </section>

      <section className={typeForm === "details" ? "block py-14" : "hidden"}>
        <MaxWidthWrapper>
          <section className="flex flex-col gap-4 lg:w-2/3 md:w-3/4 p-4 md:px-8 m-auto rounded-lg">
            <div className="flex justify-between items-center">
              <h1 className="md:text-5xl text-4xl font-semibold">{job?.title ?? "Job Title Not Available"}</h1>
              <button className="rounded-sm p-4 text-xs font-bold bg-red-900 text-white" onClick={() => setOpenApply(true)}>
                Apply Now
              </button>
            </div>
            <div className="flex flex-col justify-between gap-3">
              <div className="flex flex-row gap-3">
                <p className="border-[1px] rounded-xl px-2 py-1">{job?.state ?? "State Not Available"}</p>
                <p className="border-[1px] rounded-xl px-2 py-1">{job?.city ?? "City Not Available"}</p>
                <p className="border-[1px] rounded-xl px-2 py-1">{job?.date ? new Date(job.date).toLocaleDateString() : "Date Not Available"}</p>
              </div>
              <p className="font-semibold">Job Description:</p>
              <p className="ql-editor" dangerouslySetInnerHTML={{ __html: job?.description ?? "No description available" }}></p>
              <p className="ql-editor" dangerouslySetInnerHTML={{ __html: job?.moreinfo ?? "No description available" }}></p>
            </div>
          </section>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}

import { useState, useEffect } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { Link } from "react-router-dom";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import axios from "axios";
import "react-quill-new/dist/quill.snow.css"

export default function ForumPage() {
  const [checkAdmin, setCheckAdmin] = useState(null);

  useEffect(() => {
    async function checkUser() {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setCheckAdmin(data);
    }
    checkUser();
  }, []);

  const [displayJobs, setDisplayJobs] = useState([]);
  const [displayOptions, setDisplayOptions] = useState([]);
  const [displayAnnouncement, setDisplayAnnouncement] = useState([]);

  const handleSearchChange = (query) => {
    console.log("Search Query:", query);
    const lowerCaseQuery = query.toLowerCase();
    const filteredJobs = displayJobs.filter((job) =>
      job.title?.toLowerCase().includes(lowerCaseQuery) ||
      job.applicants?.toString().includes(lowerCaseQuery) ||
      job.remote?.toLowerCase().includes(lowerCaseQuery) ||
      job.experience?.toLowerCase().includes(lowerCaseQuery) ||
      job.jobtype?.toLowerCase().includes(lowerCaseQuery) ||
      job.salary?.toLowerCase().includes(lowerCaseQuery) ||
      job.state?.toLowerCase().includes(lowerCaseQuery) ||
      job.city?.toLowerCase().includes(lowerCaseQuery) ||
      job.street?.toLowerCase().includes(lowerCaseQuery) ||
      job.date?.toLowerCase().includes(lowerCaseQuery)
    );
    setDisplayOptions(filteredJobs);
  };

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/job/display");

        if (res.status === 200) {
          setDisplayJobs(res.data);
          setDisplayOptions(res.data);
        } else {
          console.error("Failed to fetch all jobs");
        }
      } catch (error) {
        console.error("Error fetching all jobs:", error);
      }
    };

    fetchAllJobs();
  }, []);

  useEffect(() => {
    const fetchAllAnnouncement = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/announcement/allAnnouncements");

        if (res.status === 200) {
          setDisplayAnnouncement(res.data);
        } else {
          console.error("Failed to fetch all announcements");
        }
      } catch (error) {
        console.error("Error fetching all announcements:", error);
      }
    };

    fetchAllAnnouncement();
  }, []);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <div className=" mt-14">
      <section className="flex items-center mt-14 w-full h-16 border-b-[1px] text-xs">
        <section className="w-fit lg:ml-72 flex flex-row items-center border-[1px] rounded-lg overflow-hidden bg-slate-100">
          <input
            placeholder="Find the job you're looking for"
            type="text"
            className="h-10 w-64 py-2 pl-4 outline-none bg-slate-100"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <SearchOutlinedIcon />
        </section>
      </section>
      <section className="w-screen h-fit py-7 bg-gray-100 ">
        <MaxWidthWrapper className="flex lg:flex-row flex-col-reverse gap-8">
        <section className="lg:max-w-60 flex flex-col">
            <h3 className="lg:text-lg md:mb-6 mb-4 font-bold">Announcements</h3>
            {displayAnnouncement.map((announcement, index) => (
              <section
                key={index}
                className="h-fit flex-col p-2 rounded-sm mb-2 bg-white cursor-pointer"
                onClick={() => handleAnnouncementClick(announcement)}
              >
                <div className="flex flex-row gap-2 mb-2">
                  <CircleNotificationsIcon />
                  <h1 className="text-lg font-semibold line-clamp-2">{announcement.title}</h1>
                </div>
                <p className="text-sm line-clamp-2 mb-2 text-[0.8rem] text-gray-600" 
                dangerouslySetInnerHTML={{ __html: announcement.description }}
                ></p>
                <div className="w-full py-2 text-xs flex justify-end border-t-[1px] text-slate-500 border-black">
                  <p>{new Date(announcement.date).toLocaleDateString()}</p>
                </div>
              </section>
            ))}

            {/* Modal */}
            {isModalOpen && selectedAnnouncement && (
              <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
                <div className="flex flex-col justify-between bg-white p-6 rounded-md w-1/2 h-1/2 max-w-[90%]">
                  <div >
                    <h2 className="text-2xl font-semibold mb-4">{selectedAnnouncement.title}</h2>
                    <p className=" mb-4"   dangerouslySetInnerHTML={{ __html: selectedAnnouncement.description }}></p>
                    <p className="text-sm text-gray-500">{new Date(selectedAnnouncement.date).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>


          <section className="w-full mt-8">
            <h3 className="lg:text-lg md:mb-6 mb-4 font-bold">Jobs</h3>
            <div className="flex flex-wrap gap-4 md:gap-3">
              {displayOptions.map((job, index) => (
                <section
                  key={index}
                  className="h-fit lg:w-72 md:w-60 w-56 md:py-6 py-4 px-4 rounded-md bg-white shadow-md"
                >
                  <p className="flex items-center text-xs mb-4 text-slate-500">
                    <CalendarMonthOutlinedIcon className="text-lg mr-1" />
                    {new Date(job.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm mb-1 text-blue-500">
                    {job.applicants || 0} Applicants
                  </p>
                  <h4 className="lg:text-xl text-lg mb-2 font-bold">{job.title}</h4>
                  <p
                    className="lg:text-sm text-xs line-clamp-3 text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: job.description || "No description provided.",
                    }}
                  ></p>
                  <div className="flex flex-row flex-wrap gap-2 mt-4">
                    <p className="border-2 px-2 py-1 rounded-lg md:text-[0.6rem] text-[0.5rem] tracking-wide bg-violet-200 text-violet-800">
                      {job.city || "N/A"}
                    </p>
                    <p className="border-2 px-2 py-1 rounded-lg md:text-[0.6rem] text-[0.5rem] tracking-wide bg-green-200 text-green-800">
                      {job.experience || "Not specified"}
                    </p>
                    <p className="border-2 px-2 py-1 rounded-lg md:text-[0.6rem] text-[0.5rem] tracking-wide bg-red-200 text-red-800">
                      {job.salary || "Unpaid"}
                    </p>
                  </div>
                  <div className="flex justify-end border-t-[1px] pt-4 gap-2 mt-4">
                    {checkAdmin?.role === "admin" && (
                      <Link
                        to={`/forum/edit-Job/${job.id}`}
                        className="border-[1px] text-xs rounded-md px-4 py-2 bg-[#1A2E5D] text-white"
                      >
                        Edit Job
                      </Link>
                    )}
                    <Link
                      to={`/forum/jobDetails/${job.id}`}
                      className="border-[1px] text-xs rounded-md px-4 py-2 bg-[#4BB543] text-white"
                    >
                      View Job
                    </Link>
                  </div>
                </section>
              ))}
            </div>
          </section>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}

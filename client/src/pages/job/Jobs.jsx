import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-quill-new/dist/quill.snow.css"
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AdsClickIcon from '@mui/icons-material/AdsClick';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PaymentsIcon from '@mui/icons-material/Payments';
import Groups2Icon from '@mui/icons-material/Groups2';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Footer from "@/components/Footer";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function JobsPage() {
  const navigate = useNavigate()
  const [checkAdmin, setCheckAdmin] = useState(null);
  const [displayJobs, setDisplayJobs] = useState([]);
  const [displayOptions, setDisplayOptions] = useState([]);
  const [selectOption, setSelectOptions] = useState(0)
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");

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

    const fetchBookmarkedJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/job/bookmarks", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setBookmarkedJobs(res.data.map((bookmark) => bookmark.job_id));
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchAllJobs();
    fetchBookmarkedJobs();
  }, []);


  const toggleBookmark = async (jobId) => {
    try {
      if (bookmarkedJobs.includes(jobId)) {
        const res = await axios.delete(
          `http://localhost:5000/api/job/bookmarks/${jobId}`,
          { withCredentials: true }
        );
        
        if (res.status === 401) {
          navigate("/user/login"); 
          return;
        }
  
        setBookmarkedJobs(bookmarkedJobs.filter((id) => id !== jobId));
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/job/bookmarks",
          { job_id: jobId },
          { withCredentials: true }
        );
  
        if (res.status === 401) {
          navigate("/user/login");
          return;
        }
  
        setBookmarkedJobs([...bookmarkedJobs, jobId]);
      }
    } catch (error) {
      if (error.status === 401) {
        navigate("/user/login");
      } else {
        console.error("Error toggling bookmark:", error);
      }
    }
  };



  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const totalPages = Math.ceil(displayOptions.length / jobsPerPage);

  const currentJobs = displayOptions.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  useEffect(() => {
    if (selectOption >= displayJobs.length) {
      setSelectOptions(0);
    }
  }, [selectOption, displayJobs]);

  useEffect(() => {
    handleFilters(searchQuery, selectedJobType, selectedLocation, selectedSalary);
  }, [searchQuery, selectedJobType, selectedLocation, selectedSalary]);

  const parseSalary = (salary) => {
    if (!salary) return 0;
    const numericValue = parseInt(salary.replace(/[^0-9]/g, ""), 10);
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const handleFilters = (query, jobType, location, salary) => {
    const lowerCaseQuery = query.toLowerCase();

    const filteredJobs = displayJobs.filter((job) => {
      const matchesSearchTerm =
        job.title?.toLowerCase().includes(lowerCaseQuery) ||
        job.applicants?.toString().includes(lowerCaseQuery) ||
        job.remote?.toLowerCase().includes(lowerCaseQuery) ||
        job.experience?.toLowerCase().includes(lowerCaseQuery) ||
        job.jobtype?.toLowerCase().includes(lowerCaseQuery) ||
        job.salary?.toLowerCase().includes(lowerCaseQuery) ||
        job.state?.toLowerCase().includes(lowerCaseQuery) ||
        job.city?.toLowerCase().includes(lowerCaseQuery) ||
        job.street?.toLowerCase().includes(lowerCaseQuery) ||
        job.date?.toLowerCase().includes(lowerCaseQuery);

      const matchesJobType = jobType ? job.jobtype === jobType : true;
      const matchesLocation = location ? job.state === location : true;
      const matchesSalary = selectedSalary
        ? selectedSalary === "0"
          ? !parseSalary(job.salary)
          : parseSalary(job.salary) >= parseInt(selectedSalary)
        : true;

      return matchesSearchTerm && matchesJobType && matchesLocation && matchesSalary;
    });
    setDisplayOptions(filteredJobs);
  };

  const jobTypes = Array.from(new Set(displayJobs.map((job) => job.jobtype))).filter(Boolean);
  const locations = Array.from(new Set(displayJobs.map((job) => job.state))).filter(Boolean);
  const salaryRanges = [
    { label: "10k+", min: 10000 },
    { label: "20k+", min: 20000 },
    { label: "30k+", min: 30000 },
    { label: "40k+", min: 40000 },
    { label: "50k+", min: 50000 },
    { label: "Unpaid", min: 0, max: 0 },
  ];

  const [isJobTypeOpen, setJobTypeOpen] = useState(false);
  const [isLocationOpen, setLocationOpen] = useState(false);
  const [isSalaryOpen, setSalaryOpen] = useState(false);




  return (
    <div className="mt-14">
      <MaxWidthWrapper className="flex justify-end w-full lg:h-20 h-fit border-b-[1px] xl:text-sm text-xs bg-[#333333]">
        <section className="flex lg:flex-row flex-col-reverse items-center w-full lg:mx-20 m-2 gap-6">
          <section className=" w-full">
            <div className=" xl:mr-40 md:mr-16 flex flex-row item md:gap-4 gap-2">
              {/* Job Type Filter */}
              <div className="relative xl:w-56  w-full">
                <button
                  onClick={() => setJobTypeOpen(!isJobTypeOpen)}
                  className="w-full lg:h-11 h-9  py-2 px-4 text-left bg-white border border-gray-300 rounded-xl flex items-center justify-between"
                >
                  {selectedJobType || "Select Job Type"}
                  <span className="ml-2 text-gray-500"><ExpandMoreIcon /></span>
                </button>
                {isJobTypeOpen && (
                  <ul className="absolute top-14 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    <li
                      onClick={() => {
                        setSelectedJobType("");
                        setJobTypeOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      All Job Types
                    </li>
                    {jobTypes.map((jobType) => (
                      <li
                        key={jobType}
                        onClick={() => {
                          setSelectedJobType(jobType);
                          setJobTypeOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {jobType}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Location Filter */}
              <div className="relative xl:w-56 w-full">
                <button
                  onClick={() => setLocationOpen(!isLocationOpen)}
                  className="w-full lg:h-11 h-9  py-2 px-4 text-left bg-white border border-gray-300 rounded-xl flex items-center justify-between"
                >
                  {selectedLocation || "Select Location"}
                  <span className="ml-2 text-gray-500"><ExpandMoreIcon /></span>
                </button>
                {isLocationOpen && (
                  <ul className="absolute top-14 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    <li
                      onClick={() => {
                        setSelectedLocation("");
                        setLocationOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      All Locations
                    </li>
                    {locations.map((location) => (
                      <li
                        key={location}
                        onClick={() => {
                          setSelectedLocation(location);
                          setLocationOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {location}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Salary Filter */}
              <div className="relative xl:w-56 w-full">
                <button
                  onClick={() => setSalaryOpen(!isSalaryOpen)}
                  className="w-full lg:h-11 h-9 py-2 px-4 text-left bg-white border border-gray-300 rounded-xl flex items-center justify-between"
                >
                  {selectedSalary === "0" ? "Unpaid" : selectedSalary ? `${selectedSalary}+` : "Select Salary Range"}
                  <span className="ml-2 text-gray-500"><ExpandMoreIcon /></span>
                </button>
                {isSalaryOpen && (
                  <ul className="absolute top-14 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    <li
                      onClick={() => {
                        setSelectedSalary("");
                        setSalaryOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      All Salaries
                    </li>
                    {salaryRanges.map((range) => (
                      <li
                        key={range.label}
                        onClick={() => {
                          setSelectedSalary(range.min.toString());
                          setSalaryOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {range.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
          <div className="lg:w-1/2 w-full flex flex-row items-center border-[1px] rounded-xl overflow-hidden bg-white">
            <input
              placeholder="Find the job you're looking for"
              type="text"
              className="lg:h-11 h-9 w-full py-2 pl-4 outline-none "
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchOutlinedIcon className="mr-2" />
          </div>
        </section>
      </MaxWidthWrapper>
      <MaxWidthWrapper >
        <div className=" flex lg:flex-row flex-col  justify-center lg:mx-20 m-2 lg:my-6 gap-6 ">
          {/* Description */}
          <section className="h-[90vh] w-full px-4 pb-4 lg:block hidden  sticky top-16 rounded-md overflow-y-auto border-[1px]">
            <div className="sticky top-0 flex flex-row justify-between flex-wrap border-b-[1px] py-4  bg-white">
              <h2 className="mt-2 text-3xl font-bold tracking-wider text-[#333333]">{displayOptions[selectOption]?.title}</h2>
              <div className=" flex items-center gap-2 mt-2">
                {checkAdmin?.role === "admin" && (
                  <Link
                    to={`/jobs/edit-job/${displayOptions[selectOption]?.id}`}
                    className="border-[1px] font-medium text-sm rounded-md p-3 bg-[#333333] hover:bg-[#121212] text-white"
                  >
                    Edit Job
                    <EditIcon className="ml-1" />
                  </Link>
                )}
                <Link
                  to={`/jobs/jobDetails/${displayOptions[selectOption]?.id}`}
                  className="border-[1px] font-medium text-sm rounded-md p-3 bg-red-900 hover:bg-red-700 text-white"
                >
                  Check More Information
                  <AdsClickIcon className="ml-1" />
                </Link>
                <button
                  onClick={() => toggleBookmark(displayOptions[selectOption]?.id)}
                  className={`font-medium text-sm rounded-md p-3 pr-4 border-[1px] ${bookmarkedJobs.includes(displayOptions[selectOption]?.id)
                    ? "text-red-700"
                    : "hover:text-red-700"
                    }`}
                >
                  {bookmarkedJobs.includes(displayOptions[selectOption]?.id) ? (
                    <BookmarkIcon className="ml-1" />
                  ) : (
                    <BookmarkBorderIcon className="ml-1" />
                  )}
                  Save
                </button>
              </div>

            </div>
            <div className="w-full flex justify-evenly flex-wrap gap-6 bg-slate-100 p-4 rounded-md lg:text-sm text-xs text-slate-500">
              <p><AssignmentIndIcon className="mr-1" />Publisher: {displayOptions[selectOption]?.name}</p>
              <p><EmailIcon className="mr-1" />{displayOptions[selectOption]?.email}</p>
              <p><LocationOnIcon className="mr-1" />{displayOptions[selectOption]?.state}, {displayOptions[selectOption]?.city}, {displayOptions[selectOption]?.street}</p>
              <p><Groups2Icon className="mr-1" />Applicants: {displayOptions[selectOption]?.applicants}</p>
              <p><PersonSearchIcon className="mr-1" />{displayOptions[selectOption]?.experience} · {displayOptions[selectOption]?.remote} · {displayOptions[selectOption]?.jobtype}</p>
              <p><PaymentsIcon className="mr-1" />{displayOptions[selectOption]?.salary ? displayOptions[selectOption]?.salary : "Unpaid"}</p>
              {displayOptions[selectOption]?.update_date ? <p>Updated: {new Date(displayOptions[selectOption]?.update_date).toLocaleDateString()} </p>
                :
                <p>Posted : {new Date(displayOptions[selectOption]?.date).toLocaleDateString()} </p>
              }
            </div>
            <img src={displayOptions[selectOption]?.file_data} alt={displayOptions[selectOption]?.file_name || "Job image"} style={{ width: "200px" }} />
            <div className="flex flex-row flex-wrap gap-2 mt-4 text-xs">
              <p className="border-2 px-2 py-1 rounded-lg tracking-wide bg-violet-200 text-violet-800">
                {displayOptions[selectOption]?.city || "N/A"}
              </p>
              <p className="border-2 px-2 py-1 rounded-lg  tracking-wide bg-green-200 text-green-800">
                {displayOptions[selectOption]?.experience || "Not specified"}
              </p>
              <p className="border-2 px-2 py-1 rounded-lg  tracking-wide bg-red-200 text-red-800">
                {displayOptions[selectOption]?.salary ? displayOptions[selectOption]?.salary : "Unpaid"}
              </p>
            </div>
            <p className="pt-4 mb-2 text-gray-600"
              dangerouslySetInnerHTML={{ __html: displayOptions[selectOption]?.description }}
            ></p>
          </section>


          {/* Job Options */}
          <section className="flex flex-col gap-6 lg:w-1/2 w-full">
      {currentJobs.map((job, index) => (
        <section
        key={job.id}
        onClick={() => setSelectOptions((currentPage - 1) * jobsPerPage + index)}
        className={`w-full h-64 border-[1px] rounded-md cursor-pointer p-4 hover:border-red-950 ${
          (currentPage - 1) * jobsPerPage + index === selectOption &&
          "border-2 border-red-950 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]"
        }`}
      >
          <div className="flex justify-between items-center">
            <p className="text-xs line-clamp-1 text-slate-500">
              {new Date(job.date).toLocaleDateString()}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(job.id);
              }}
              className={`${
                bookmarkedJobs.includes(job.id)
                  ? "text-red-700"
                  : "hover:text-red-700"
              }`}
            >
              {bookmarkedJobs.includes(job.id) ? (
                <BookmarkIcon className="ml-1" />
              ) : (
                <BookmarkBorderIcon className="ml-1" />
              )}
            </button>
          </div>
          <h3 className="mt-2 font-bold text-lg line-clamp-1 text-red-950">
            {job.title}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm">
            <LocationOnOutlinedIcon />
            {job.state}, {job.city}
          </p>
          <div className="mt-2">
            <p className="text-xs tracking-wider text-slate-500">SALARY</p>
            <p className="line-clamp-1">
              {job.salary ? job.salary : "Unpaid"}
            </p>
          </div>
          <div className="my-1">
            <p className="text-xs tracking-wider text-slate-500">HIRING</p>
            <p className="line-clamp-1">{job.experience}</p>
          </div>
          <div className="w-full flex justify-end items-center">
            <Link
              to={`/jobs/jobDetails/${job.id}`}
              className="line-clamp-1 border-[1px] font-medium text-xs rounded-md p-2 overflow-hidden bg-red-900 hover:bg-red-700 text-white"
            >
              Check Information
              <AdsClickIcon className="ml-1" />
            </Link>
          </div>
        </section>
      ))}
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === page
                ? "bg-red-900 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
        >
          Next
        </button>
      </div>
    </section>
        </div>
      </MaxWidthWrapper>

      {/* Footer */}
      <Footer />
    </div>
  );
}

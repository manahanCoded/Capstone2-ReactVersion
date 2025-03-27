import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-quill-new/dist/quill.snow.css"
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AdsClickIcon from '@mui/icons-material/AdsClick';
import EditIcon from '@mui/icons-material/Edit';
import Footer from "@/components/Footer";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export default function JobsPage() {
  const navigate = useNavigate()
  const [checkAdmin, setCheckAdmin] = useState(null);
  const [displayJobs, setDisplayJobs] = useState([]);
  const [displayOptions, setDisplayOptions] = useState([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filterBookmarked, setFilterBookmarked] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const res = await fetch(`${API_URL}/api/user/profile`, {
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
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/job/display`);

        if (res.status === 200) {
          setDisplayJobs(res.data);
          setDisplayOptions(res.data);
        } else {
          console.error("Failed to fetch all jobs");
        }
      } catch (error) {
        console.error("Error fetching all jobs:", error);
      }
      setLoading(false);
    };

    const fetchBookmarkedJobs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/job/bookmarks`, {
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
          `${API_URL}/api/job/bookmarks/${jobId}`,
          { withCredentials: true }
        );

        if (res.status === 401) {
          navigate("/user/login");
          return;
        }

        setBookmarkedJobs(bookmarkedJobs.filter((id) => id !== jobId));
      } else {
        const res = await axios.post(
          `${API_URL}/api/job/bookmarks`,
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
  const jobsPerPage = 6;

  const totalPages = Math.ceil(displayOptions.length / jobsPerPage);

  const currentJobs = displayOptions.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    handleFilters(searchQuery, selectedJobTypes, selectedLocations, selectedSalary, filterBookmarked);
  }, [searchQuery, selectedJobTypes, selectedLocations, selectedSalary, filterBookmarked]);

  const parseSalary = (salary) => {
    if (!salary) return 0;
    const numericValue = parseInt(salary.replace(/[^0-9]/g, ""), 10);
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const handleFilters = (query, jobTypes, locations, salary, bookmarkedOnly) => {
    const lowerCaseQuery = query.toLowerCase();

    const filteredJobs = displayJobs.filter((job) => {
      if (bookmarkedOnly && !bookmarkedJobs.includes(job.id)) {
        return false; 
      }

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

      const matchesJobType = jobTypes.length === 0 || jobTypes.includes(job.jobtype);

      const matchesLocation = locations.length === 0 || locations.includes(job.state);

      const matchesSalary = salary
        ? salary === "0"
          ? !parseSalary(job.salary)
          : parseSalary(job.salary) >= parseInt(salary)
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

  const handleJobTypeChange = (jobType) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jobType) ? prev.filter((jt) => jt !== jobType) : [...prev, jobType]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]
    );
  };


  return (
    <div className="mt-14">
      <MaxWidthWrapper className="flex lg:flex-row flex-col justify-between w-full gap-6 lg:py-10 pb-10">
        <section className="xl:sticky top-20 xl:w-64 xl:h-screen h-fit py-1 flex border-b-[1px] xl:text-sm text-xs ">
          <section className=" flex xl:flex-col flex-row ">
            <div className="flex lg:flex-col items-center flex-row flex-wrap md:gap-4 gap-2">
              {/* Job Type Filter */}
              <div className="lg:hidden block relative  w-[46%]">
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
                          handleJobTypeChange(jobType);
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
              <div className="lg:hidden block relative w-[46%] ">
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
                          handleLocationChange(location)
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
              <div className="relative lg:w-full  w-[46%] ">
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
              {/* Bookmarked Filter */}
              <div className="lg:hidden block relative  w-[46%]">
                <button onClick={() => setFilterBookmarked((prev) => !prev)} className={`"w-full lg:h-11 h-9 py-2 px-4 w-full p-4 ${filterBookmarked ? 'text-white bg-red-700 ' : 'bg-white '} border border-gray-300 rounded-xl `}>
                  {filterBookmarked ? 'Show All' : 'Show Bookmarked'}
                </button>
              </div>
              {/* Checkbox section */}
              {/* Job type */}
              <div className="lg:block hidden w-full p-4 bg-white border border-gray-300 rounded-xl shadow-md">
                <h3 className="font-semibold text-gray-700">Job Type</h3>
                <ul className="mt-2 space-y-2">
                  {jobTypes.map((jobType) => (
                    <li key={jobType} className="flex items-center">
                      <input
                        type="checkbox"
                        id={jobType}
                        checked={selectedJobTypes.includes(jobType)}
                        onChange={() => handleJobTypeChange(jobType)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
                      />
                      <label htmlFor={jobType} className="ml-2 text-gray-600 cursor-pointer">
                        {jobType}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              {/* lcoation */}
              <div className="lg:block hidden  w-full p-4 bg-white border border-gray-300 rounded-xl shadow-md mt-4">
                <h3 className="font-semibold text-gray-700">Location</h3>
                <ul className="mt-2 space-y-2">
                  {locations.map((location) => (
                    <li key={location} className="flex items-center">
                      <input
                        type="checkbox"
                        id={location}
                        checked={selectedLocations.includes(location)}
                        onChange={() => handleLocationChange(location)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
                      />
                      <label htmlFor={location} className="ml-2 text-gray-600 cursor-pointer">
                        {location}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <button onClick={() => setFilterBookmarked((prev) => !prev)} className={`lg:block hidden text-sm w-full p-4 font-semibold ${filterBookmarked ? 'text-white bg-red-700 ' : 'text-gray-700 bg-white '} border border-gray-300 rounded-xl shadow-md mt-4`}>
                {filterBookmarked ? 'Show All' : 'Show Bookmarked'}
              </button>
            </div>
          </section>
        </section>
        {/* Job Options */}
        <section className="w-full">
          <section className="flex flex-col gap-6 justify-between ">
            <div className="w-full flex lg:flex-row flex-col-reverse gap-y-4 justify-between items-center">
              <h1 className="md:text-4xl text-lg">Recommended Jobs <span className="md:text-2xl text-sm py-1 px-4 rounded-full border-[1px] ">{displayOptions.length}</span></h1>
              <div className="lg:w-1/2 w-full md:h-14 h-12 px-2 flex flex-row items-center border-[1px] rounded-xl overflow-hidden bg-white">
                <input
                  placeholder="Find the job you're looking for"
                  type="text"
                  className="lg:h-11 h-9 w-full py-2 pl-4 outline-none "
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchOutlinedIcon className="mr-2" />
              </div>
            </div>
            {loading ? (
              <div className="w-full flex justify-center items-center">
                <p className="text-lg font-medium animate-pulse">Loading Jobs...</p>
              </div>
            ) :
              <div className="flex flex-wrap flow-row md:justify-start justify-center sm:gap-6 gap-x-2 gap-y-6">
                {currentJobs.map((job, index) => (
                  <section
                    key={job.id}
                    className={`sm:h-[24rem] xl:w-96 md:w-80 w-[90%]  flex flex-col justify-between py-1 gap-y-2 pb-4 md:px-2 border-[1px] rounded-2xl transition-all duration-300 hover:border-red-700 hover:scale-105 hover:shadow-lg`}
                  >
                    <div className={`relative overflow-hidden sm:h-72 h-56 flex flex-col justify-between rounded-3xl p-4 transition-all duration-300 ${!job.file_data && "bg-red-950"}`}>
                      <img
                        className="absolute inset-0 w-full h-full object-cover -z-10"
                        src={job.file_data}
                        alt=""
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-75 -z-10 transition-opacity duration-300 hover:bg-opacity-50"></div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs line-clamp-1 px-2 py-1 rounded-full tracking-wide bg-white">
                          {new Date(job.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(job.id);
                            }}
                            className={`transition-colors duration-300 ${bookmarkedJobs.includes(job.id) ? "text-white" : "hover:text-white"}`}
                          >
                            {bookmarkedJobs.includes(job.id) ? <BookmarkIcon /> : <BookmarkBorderIcon className="text-white" />}
                          </button>
                        </div>
                      </div>
                      <div className="md:h-32 pr-10">
                        <h3 className="mt-2 font-medium md:text-3xl text-2xl break-words line-clamp-2 text-white">
                          {job.title}
                        </h3>
                      </div>
                      <div className="w-full flex flex-wrap flex-row items-center sm:gap-4 gap-2 md:text-[0.7rem] text-[0.5rem] text-black">
                        <p className="px-2 py-1 rounded-full tracking-wide bg-white">{job.remote}</p>
                        <p className="px-2 py-1 rounded-full tracking-wide bg-white">{job.jobtype}</p>
                        <p className="px-2 py-1 rounded-full tracking-wide bg-white">{job.experience}</p>
                      </div>
                    </div>
                    <section className="w-full flex justify-between items-center px-3 gap-2">
                      <div className="flex flex-col">
                        <p className="sm:text-xl font-medium italic">{job?.salary ? job.salary : "Unpaid"}</p>
                        <p className="sm:text-sm text-xs text-gray-500">{job.city}</p>
                      </div>
                      <div className="flex flex-row items-center sm:gap-2 gap-1">
                        {checkAdmin?.role === "admin" && (
                          <Link
                            to={`/jobs/edit-job/${job.id}`}
                            className="line-clamp-1 border-[1px] md:font-medium text-xs rounded-md sm:p-2 px-1 py-0.5 bg-[#333333] hover:bg-[#121212] transition-colors duration-300 text-white"
                          >
                            Edit Job
                            <EditIcon className="ml-1" />
                          </Link>
                        )}
                        <Link
                          to={`/jobs/jobDetails/${job.id}`}
                          className="line-clamp-1 border-[1px] md:font-medium text-xs rounded-md sm:p-2 px-1 py-0.5 bg-red-900 hover:bg-red-700 transition-colors duration-300 text-white"
                        >
                          Details
                          <AdsClickIcon className="ml-1" />
                        </Link>
                      </div>
                    </section>
                  </section>

                ))}
              </div>
            }
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
                  className={`px-3 py-1 rounded-md border ${currentPage === page
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
        </section>
      </MaxWidthWrapper>
      {/* Footer */}
      <Footer />
    </div>
  );
}

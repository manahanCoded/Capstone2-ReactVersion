import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  const [selectOption, setSelectOptions] = useState(0)


  const handleSearchChange = (query) => {
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
    if (selectOption >= displayJobs.length) {
      setSelectOptions(0);
    }
  }, [selectOption, displayJobs]);

  const PaginatedSection = ({ displayOptions }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
  
    // Calculate total pages
    const totalPages = Math.ceil(displayOptions.length / itemsPerPage);
  
    // Get items for the current page
    const currentItems = displayOptions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    // Handle page change
    const handlePageChange = (newPage) => {
      if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };
  }


  return (
    <div className=" mt-14">
      <MaxWidthWrapper className="flex justify-end  mt-14 w-full h-14 border-b-[1px] text-xs">
        <section className="flex flex-row w-full lg:mx-20 m-2 gap-6 ">
        <div className="lg:block hidden w-full"></div>
        <div className="lg:w-1/3 w-full flex flex-row items-center border-[1px] rounded-lg overflow-hidden bg-slate-100">
          <input
            placeholder="Find the job you're looking for"
            type="text"
            className="h-9 w-full py-2 pl-4 outline-none bg-slate-100"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <SearchOutlinedIcon className="mr-2"/>
        </div>
        </section>
      </MaxWidthWrapper>
      <MaxWidthWrapper >
        <div className=" flex lg:flex-row flex-col  justify-center lg:mx-20 m-2 lg:my-6 gap-6 ">
          {/* Description */}
          <section className="h-[90vh] w-full px-4 pb-4 lg:block hidden  sticky top-16 rounded-md overflow-y-auto border-[1px]">
            <div className="sticky top-0 flex flex-row justify-between flex-wrap border-b-[1px] py-4  bg-white">
              <h2 className="mt-2 text-3xl font-bold tracking-wider text-[#333333]">{displayJobs[selectOption]?.title}</h2>
              <div className=" flex items-center gap-2 mt-2">
                {checkAdmin?.role === "admin" && (
                  <Link
                    to={`/forum/edit-Job/${displayJobs[selectOption]?.id}`}
                    className="border-[1px] font-medium text-sm rounded-md p-3 bg-[#333333] text-white"
                  >
                    Edit Job
                    <EditIcon className="ml-1" />
                  </Link>
                )}
                <Link
                  to={`/forum/jobDetails/${displayJobs[selectOption]?.id}`}
                  className="border-[1px] font-medium text-sm rounded-md p-3 bg-red-900 hover:bg-red-700 text-white"
                >
                  Check More Information
                  <AdsClickIcon className="ml-1" />
                </Link>
              </div>

            </div>
            <div className="w-full flex justify-evenly flex-wrap gap-6 bg-slate-100 p-4 rounded-md lg:text-sm text-xs text-slate-500">
              <p><AssignmentIndIcon className="mr-1" />Publisher: {displayJobs[selectOption]?.name}</p>
              <p><EmailIcon className="mr-1" />{displayJobs[selectOption]?.email}</p>
              <p><LocationOnIcon className="mr-1" />{displayJobs[selectOption]?.state}, {displayJobs[selectOption]?.city}, {displayJobs[selectOption]?.street}</p>
              <p><Groups2Icon className="mr-1" />Applicants: {displayJobs[selectOption]?.applicants}</p>
              <p><PersonSearchIcon className="mr-1" />{displayJobs[selectOption]?.experience} · {displayJobs[selectOption]?.remote} · {displayJobs[selectOption]?.jobtype}</p>
              <p><PaymentsIcon className="mr-1" />{displayJobs[selectOption]?.salary ? displayJobs[selectOption]?.salary : "Unpaid"}</p>
              {displayJobs[selectOption]?.update_date ? <p>Updated: {new Date(displayJobs[selectOption]?.update_date).toLocaleDateString()} </p>
                :
                <p>Uploaded: {new Date(displayJobs[selectOption]?.date).toLocaleDateString()} </p>
              }
            </div>
            <div className="flex flex-row flex-wrap gap-2 mt-4 text-xs">
              <p className="border-2 px-2 py-1 rounded-lg tracking-wide bg-violet-200 text-violet-800">
                {displayJobs[selectOption]?.city || "N/A"}
              </p>
              <p className="border-2 px-2 py-1 rounded-lg  tracking-wide bg-green-200 text-green-800">
                {displayJobs[selectOption]?.experience || "Not specified"}
              </p>
              <p className="border-2 px-2 py-1 rounded-lg  tracking-wide bg-red-200 text-red-800">
                {displayJobs[selectOption]?.salary ? displayJobs[selectOption]?.salary : "Unpaid"}
              </p>
            </div>
            <p className="pt-4 mb-2 text-gray-600" 
                dangerouslySetInnerHTML={{ __html:  displayJobs[selectOption]?.description }}
                ></p>
          </section>


          {/* Job Options */}
          <section className="flex flex-col gap-6 lg:w-1/3 w-full">
            {displayOptions.map((job, index) => (
              <section
                key={job.id}
                onClick={() => { setSelectOptions(index) }}
                className={`w-full h-72 border-[1px] rounded-md cursor-pointer p-4 hover:border-red-950 ${index === selectOption && "border-red-950 shadow-[5px_5px_rgba(255,_0,_0,_0.4),_10px_10px_rgba(255,_0,_0,_0.3),_15px_15px_rgba(255,_0,_0,_0.2),_20px_20px_rgba(255,_0,_0,_0.1),_25px_25px_rgba(255,_0,_0,_0.05)]"}`}>
                <p className="flex justify-end text-xs line-clamp-1 text-slate-500">{new Date(job.date).toLocaleDateString()}</p>
                <h3 className="mt-2 font-bold text-lg line-clamp-1 text-red-950">{job.title}</h3>
                <p className="mt-4 line-clamp-1 text-sm"><LocationOnOutlinedIcon/>{job.state}, {job.city}</p>
                <div className="mt-4">
                  <p className="text-xs tracking-wider text-slate-500">SALARY</p>
                  <p className="line-clamp-1">{job.salary?job.salary: "Unpaid" }</p>
                </div>
                <div className="my-4">
                  <p className="text-xs tracking-wider text-slate-500">HIRING</p>
                  <p className="line-clamp-1">{job.experience}</p>
                </div>
                <div className="w-full flex justify-end items-center">
                <Link
                  to={`/forum/jobDetails/${job.id}`}
                  className="line-clamp-1 border-[1px] font-medium text-xs rounded-md p-2 overflow-hidden bg-red-900 hover:bg-red-700 text-white"
                >
                  Check Information
                  <AdsClickIcon className="ml-1" />
                </Link>
                </div>
              </section>
            ))}
          </section>
        </div>
      </MaxWidthWrapper>
    
    {/* Footer */}
     <Footer/>
    </div>
  );
}

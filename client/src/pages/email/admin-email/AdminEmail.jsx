import DrawIcon from '@mui/icons-material/Draw';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminDashboard from "@/components/AdminDashboard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminEmail() {
    const [checkAdmin, setCheckAdmin] = useState(null)
    const [applicants, setApplicants] = useState([])
    const [mail, setMail] = useState(null);
    const [successReply, setSuccessReply] = useState(false)
    const [showReply, setShowReply] = useState(false)
    const [viewReply, setViewReply] = useState([])
    const parentReply = viewReply?.find(reply => reply.aplicant_name === mail?.fullname);
    const [reply, setReply] = useState({
        id: "",
        admin: "",
        title: mail?.job_title,
        parent_id: parentReply?.id || null,
        aplicant_name: mail?.fullname,
        aplicant_email: mail?.email,
        reply: "",
        type: "job",
        date: new Date().toISOString().split("T")[0],
        is_reply: true
    })

    const [searchQuery, setSearchQuery] = useState("");

    const filteredApplicants = applicants?.filter((applicant) => {
        const search = searchQuery.toLowerCase();
        return (
            applicant.fullname.toLowerCase().includes(search) ||
            applicant.job_title.toLowerCase().includes(search) ||
            applicant.application.toLowerCase().includes(search)
        );
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const navigate = useNavigate()

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
                setCheckAdmin(data);
                setReply((prev) => (({ ...prev, admin: data.email })))

                if (data.role === "client") {
                    navigate("/email");
                }


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


    useEffect(() => {
        const application = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/job/display-appointment`);
                setApplicants(res.data);
                setMail(res.data[0]);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            }
        };
        application();
    }, []);

    const handleEmail = (e) => {
        const emailValue = applicants.find(
            (applicant) => applicant.id == e.currentTarget.id
        );
        setSuccessReply(false);
        setMail(emailValue ?? null);
    };

    const formattedDate = mail?.date ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(new Date(mail.date)) : '';

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.reply || reply.reply.trim() === "") {
            alert("Reply cannot be empty or repeated.");
            return;
        }
        const updatedReply = {
            parent_id: parentReply?.id || null,
            title: mail?.job_title || "",
            admin: checkAdmin?.email || "",
            aplicant_name: mail?.fullname || "",
            aplicant_email: mail?.email || "",
            reply: reply.reply,
            type: "job",
            date: new Date().toISOString().split("T")[0],
            is_reply: false
        };

        try {
            setSuccessReply(true);
            const res = await axios.post(`${API_URL}/api/mail/sendMail`, updatedReply, {
                withCredentials: true,
            });

            setReply((prev) => ({
                ...prev,
                reply: ""
            }));
        } catch (error) {
            console.error("Error sending reply:", error);
        }
    };

    const handleResponseReply = async () => {
        if (!reply.reply || reply.reply.trim() === "") {
            alert("Reply cannot be empty or repeated.");
            return;
        }
        const updatedReply = {
            parent_id: parentReply?.id || null,
            admin: checkAdmin?.email || "",
            title: mail?.job_title || "",
            aplicant_name: mail?.fullname || "",
            aplicant_email: mail?.email || "",
            reply: reply.reply,
            type: "job",
            date: new Date().toISOString().split("T")[0],
            is_reply: true
        };

        try {
            setSuccessReply(true);
            const res = await axios.post(`${API_URL}/api/mail/replyMail`, updatedReply, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setReply((prev) => ({
                ...prev,
                reply: ""
            }));
        } catch (error) {
            console.error("Error sending reply:", error);
        }
    };


    useEffect(() => {
        const updateResponse = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/mail/allMail`);
                setViewReply(res.data);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            }
        }
        updateResponse()
    }, [handleReply])

    useEffect(() => {
        setReply((prev) => ({
            ...prev,
            title: mail?.job_title,
            parent_id: parentReply?.id || null,
            aplicant_name: mail?.fullname || "",
            aplicant_email: mail?.email || "",
        }));
    }, [mail]);

    const handleDeleteReply = async (e) => {
        try {
            const replyIdFromEvent = e.currentTarget.id;
            const selectedReply = viewReply.find((r) => r.id == replyIdFromEvent);

            const isNestedReply = selectedReply.parent_id !== null;

            if (!isNestedReply) {
                const confirmDelete = window.confirm(
                    "This is a main reply. Deleting this will also remove all associated replies. Are you sure you want to continue?"
                );
                if (!confirmDelete) return;
            }

            const res = await axios.delete(`${API_URL}/api/mail/deleteMail/${replyIdFromEvent}`);
            if (res.status === 200) {
                alert("Reply deleted successfully!");
                setViewReply((prevReplies) => prevReplies.filter((r) => r.id !== replyIdFromEvent));
            } else {
                alert("Failed to delete reply.");
            }
        } catch (error) {
            console.error("Error deleting reply:", error);
        }
    };



    return (
        <div className="mt-14 h-screen text-sm">
            <AdminDashboard />
            <MaxWidthWrapper className=" md:px-0 h-screen flex flex-row ">
                <div className="lg:w-[32%] md:w-[52%] flex flex-col border-r-[1px] border-b-[1px]">
                    {/* Search and Filter Section */}
                    <section className="min-h-12 w-full border-b-[1px]">
                        <MaxWidthWrapper className="h-full flex gap-2 flex-row justify-between items-center">
                            <div className="flex items-center justify-center mt-2 w-full border-[1px] rounded-full pr-2 border-gray-400">
                                <input
                                    className="w-full px-4 py-1 rounded-s-full mr-1"
                                    placeholder="Search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <SearchOutlinedIcon className="text-gray-500" />
                            </div>
                        </MaxWidthWrapper>
                    </section>

                    {/* Applicants List Section */}
                    <section className="h-full overflow-y-auto py-4">
                        <MaxWidthWrapper>
                            {filteredApplicants?.map((applicant, index) => {
                                return (
                                    <section
                                        key={index}
                                        onClick={handleEmail}
                                        id={applicant.id}
                                        className="p-3 mt-3 flex flex-col gap-2 rounded-sm text-sm cursor-pointer hover:bg-slate-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                    >
                                        <div className="flex flex-row justify-between">
                                            <h3 className="font-semibold">{applicant.fullname}</h3>
                                            <p className="text-xs text-gray-400">{applicant.date}</p>
                                        </div>
                                        <p className="line-clamp-2 text-xs">{applicant.application}</p>
                                        <p className="bg-[#333333] py-1 px-2 rounded-lg text-white text-[10px] font-semibold w-fit">
                                            {applicant.job_title}
                                        </p>
                                    </section>
                                );
                            })}
                        </MaxWidthWrapper>
                    </section>
                </div>
                <div className=" w-full md:flex lg:flex-row flex-col ">
                    <section className="lg:w-2/3 border-x-[1px]">
                        <MaxWidthWrapper className="p-4 border-b-[1px] flex flex-row justify-between items-center text-xs">
                            <div className="flex flex-row items-center gap-1">
                                <AccountCircleIcon style={{ fontSize: '2.5rem' }} />
                                <div className="flex flex-col">
                                    <p>{mail?.fullname}</p>
                                    <p>{mail?.email}</p>
                                </div>
                            </div>
                            <p>{formattedDate}</p>
                        </MaxWidthWrapper>

                        <MaxWidthWrapper className="p-4 ">
                            <p>{mail?.fullname}</p>
                            <h2 className="text-md font-semibold">Application Details</h2>
                            <p>{mail?.name}</p>
                            <div className='mt-4'>
                            {mail?.resumeUrl && (
                                <>
                                    {mail?.resumeUrl.startsWith('data:image/') ? (
                                        <img src={mail?.resumeUrl} alt="Applicant Resume" style={{ width: "200px", height: "auto" }} />
                                    ) : (
                                        <a href={`${API_URL}/api/job/download/${mail.id}`} className='bg-[#333333] px-3 py-2 text-white rounded-md'>
                                        Download Resume
                                      </a>
                                    )}
                                </>
                            )}
                            </div>
                        </MaxWidthWrapper>
                    </section>
                    {/* Reply */}
                    <section className="sticky top-14 flex flex-col items-center lg:w-1/3  h-fit">
                        <div className="w-full px-4 flex items-center justify-start"
                            onClick={() => setShowReply(!showReply)}>
                            <p className={`h-12 px-3 flex items-center border-x-[1px] hover:bg-[#333333] hover:text-white cursor-pointer ${showReply ? "bg-[#333333] text-white" : "bg-white text-black"}`}>View Reply</p>
                        </div>

                        {showReply ?
                            <div className="flex flex-col gap-4 p-4 border-y-[1px] w-full">
                                {viewReply && viewReply.filter((replies) => replies.aplicant_name === mail?.fullname).length > 0 ? (
                                    viewReply
                                        .filter((replies) => replies.aplicant_name === mail?.fullname)
                                        .map((reply, index) => (
                                            <section key={index} className="flex flex-col gap-4 p-2 border-b-[1px]">
                                                <p>{reply.parent_id ? "" : <DrawIcon />}</p>
                                                <div className="flex flex-row items-center justify-between text-xs text-gray-400">
                                                    <p> Replied by: {reply.admin} </p>
                                                    <p>
                                                        {new Date(reply.date.toString()).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                                <p>{reply.reply}</p>
                                                <textarea required className="h-16 w-full p-2 border-[1px] text-xs rounded-sm" placeholder="Reply something..."
                                                    onChange={(e) => setReply(prev => ({ ...prev, reply: e.target.value }))}
                                                ></textarea>
                                                <div className="w-full flex flex-row justify-between text-xs">
                                                    <button id={reply.id} className="py-2 px-4 rounded-md bg-red-600 text-white"
                                                        onClick={handleDeleteReply}
                                                    >Delete</button>
                                                    <button className="py-2 px-4 rounded-md border-2 border-black hover:bg-[#333333] hover:text-white"
                                                        onClick={handleResponseReply}
                                                    >Reply</button>
                                                </div>
                                            </section>
                                        ))
                                ) : (
                                    <div>No replies found</div>
                                )}
                            </div>
                            :
                            <form onSubmit={handleReply} className="flex flex-col gap-4 p-4 border-y-[1px] w-full">
                                <textarea className="lg:h-96 h-16 lg:rounded-none rounded-sm w-full  focus:outline-none focus:ring-1 py-4 px-2 focus:ring-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                    placeholder={`Reply to ${mail?.fullname}`}
                                    value={reply.reply}
                                    required
                                    onChange={(e) => (setReply({ ...reply, reply: e.target.value }))}
                                ></textarea>
                                <div className="flex flex-row justify-between">
                                    <p className="text-green-600" > {successReply ? "Reply Sent" : null}</p>
                                    <button className=" py-2 px-6 rounded-md font-semibold text-sm text-white bg-[#333333]">Send</button>
                                </div>
                            </form>
                        }
                    </section>


                </div>
            </MaxWidthWrapper>


        </div >
    )
}


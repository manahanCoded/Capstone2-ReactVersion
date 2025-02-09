import axios from 'axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UserApplications({ checkUser }) {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        async function fetchApplications() {
            if (checkUser?.email) {
                try {
                    const res = await axios.get(`${API_URL}/api/job/display-user-appointment/${checkUser.email}`);
                    setApplications(res.data);
                } catch (error) {
                    console.error("Error fetching applications:", error);
                }
            }
        }
        fetchApplications();
    }, [checkUser?.email]);

    if (!checkUser) {
        return <div className="flex justify-center items-center h-full text-gray-500">No user found.</div>;
    }

    return (
        <section className="flex flex-col p-6 h-full w-full text-gray-900 bg-white rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] ">
            <h2 className="text-xl font-semibold text-white bg-red-900 rounded-full py-2 px-4 self-start">Applications</h2>
            <div className="mt-6 space-y-4">
                {applications.length > 0 ? (
                    applications.map((application, index) => {
                        const formattedDate = new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        }).format(new Date(application.date));

                        return (
                            <section key={index} className="bg-white p-4 rounded-lg shadow border-[1px] ">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <p className="truncate font-medium">{application.fullname}</p>
                                    <p className="text-gray-500">{formattedDate}</p>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800 mt-2">{application.job_title}</h3>
                                <div className="flex justify-end mt-4">
                                    <Link to="/email" className="bg-[#333333] text-white text-xs px-4 py-3 rounded-md shadow hover:bg-gray-800 transition">
                                        Check Email
                                    </Link>
                                </div>
                            </section>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 text-lg">No applications available.</p>
                )}
            </div>
        </section>
    );
}

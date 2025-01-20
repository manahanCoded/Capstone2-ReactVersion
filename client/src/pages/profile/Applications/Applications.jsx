import axios from 'axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function UserApplications({ checkUser }) {
    const [applications, setApplications] = useState([]);


    if (!checkUser) {
        return <div>No user found.</div>;
    }

    useEffect(() => {
        async function fetchApplications() {
            if (checkUser?.email) {
                try {
                    const res = await axios.get(`http://localhost:5000/api/job/display-user-appointment/${checkUser.email}`);
                    setApplications(res.data);
                } catch (error) {
                    console.error("Error fetching applications:", error);
                }
            }
        }
        fetchApplications();
    }, [checkUser?.email]); // Run effect only when checkUser.email changes

    return (
        <section className="flex-col p-4 h-full w-full text-black overflow-y-auto">
            <h2 className="text-xl tracking-wide font-semibold bg-red-600 text-white w-fit rounded-full py-1 px-3">Applications</h2>
            <div className="flex flex-col gap-2 mt-6">
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
                            <section key={index} className="flex flex-col gap-2 border-[1px] rounded-md py-2 px-4">
                                <div className="flex flex-row justify-between items-center text-xs">
                                    <p className="line-clamp-1">{application.fullname}</p>
                                    <p>{formattedDate}</p>
                                </div>
                                <h3 className="font-semibold">{application.job_title}</h3>
                                <div className="px-3 flex justify-end w-full text-xs">
                                    <Link to="/email" className="bg-black p-2 text-white rounded-md">Check Email</Link>
                                </div>
                            </section>
                        );
                    })
                ) : (
                    <p>No applications available.</p>
                )}
            </div>
        </section>
    );
}

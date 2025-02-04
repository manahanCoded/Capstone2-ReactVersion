import { Link, useLocation } from "react-router-dom"
import MaxWidthWrapper from "./MaxWidthWrapper"



const AdminDashboard = () => {
    const location = useLocation()
    return (
        <section>
            <MaxWidthWrapper className="h-12 flex flex-row justify-between items-center border-b-2 ">
                <div className="w-full flex flex-row justify-between">
                <section className="w-full text-xs flex flex-row justify-start gap-8 ">
                    <Link
                        to="/user/accounts-dashboard" className={`${location.pathname === "/user/accounts-dashboard" ? "px-3 py-2 rounded-2xl bg-gray-200 border-[1px]" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold cursor-pointer `}>
                        Accounts
                    </Link>
                    <Link
                        to="/user/modules-dashboard" className={`${location.pathname === "/user/modules-dashboard" ? "px-3 py-2 rounded-2xl bg-gray-200 border-[1px]" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold cursor-pointer `}>
                        Module
                    </Link>
                    <Link
                        to="/user/jobs-dashboard" className={`${location.pathname === "/jobs/jobs-dashboard" ? "px-3 py-2 rounded-2xl bg-gray-200 border-[1px]" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold cursor-pointer `}>
                        Jobs
                    </Link>
                    <Link
                        to="/user/announcements-dashboard" className={`${location.pathname === "/announcement" ? "px-3 py-2 rounded-2xl bg-gray-200 border-[1px]" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold px-3 py-2  cursor-pointer`}>
                        Announcement
                    </Link>
                    <Link
                        to="/email" className={`${location.pathname === "/email" ? "px-3 py-2 rounded-2xl bg-gray-200 border-[1px]" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold px-3 py-2  cursor-pointer`}>
                        Email
                    </Link>

                </section>

                </div>
            </MaxWidthWrapper>
        </section>
    )
}

export default AdminDashboard
import { Link, useLocation } from "react-router-dom"
import MaxWidthWrapper from "./MaxWidthWrapper"



const AdminDashboard = () => {
    const location = useLocation()
    return (
        <section>
            <MaxWidthWrapper className="h-12 flex flex-row flex-wrap justify-between items-center border-b-2 ">
                <section className="w-full md:text-xs text-[0.6rem] flex flex-row md:justify-start justify-between md:space-x-8 gap-3">
                    <Link
                        to="/user/accounts-dashboard" className={`${location.pathname === "/user/accounts-dashboard" ? "px-3 py-2 rounded-2xl bg-gray-200 border" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold cursor-pointer `}>
                        Accounts
                    </Link>
                    <Link
                        to="/user/modules-dashboard" className={`${location.pathname === "/user/modules-dashboard" ? "px-3 py-2 rounded-2xl bg-gray-200 border" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold cursor-pointer `}>
                        Module
                    </Link>
                    <Link
                        to="/user/jobs-dashboard" className={`${location.pathname === "/user/jobs-dashboard" ? "px-3 py-2 rounded-2xl bg-gray-200 border" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold cursor-pointer `}>
                        Jobs
                    </Link>
                    <Link
                        to="/user/announcements-dashboard" className={`${location.pathname === "/user/announcements-dashboard" ? "px-3 py-2 rounded-2xl bg-gray-200 border" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold px-3 py-2  cursor-pointer`}>
                        Announcement
                    </Link>
                    <Link
                        to="/admin-email" className={`${location.pathname === "/admin-email" ? "px-3 py-2 rounded-2xl bg-gray-200 border" : ""}w-20  flex justify-center items-center hover:text-gray-500 font-semibold px-3 py-2  cursor-pointer`}>
                        Email
                    </Link>

                </section>
            </MaxWidthWrapper>
        </section>
    )
}

export default AdminDashboard
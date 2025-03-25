import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BalanceIcon from "@mui/icons-material/Balance";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PublicIcon from "@mui/icons-material/Public";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function JobHome() {


    const LearnMore = () => {
        alert("Comming soon next update!")
    }

    return (
        <div className="h-screen mt-14 bg-gray-50">

            <div className="relative h-[32rem]">
                <img
                    src="/IMG_Jobs/job1.jpg"
                    alt="Job Image"
                    className="h-full w-full object-cover"

                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>


            <MaxWidthWrapper className="absolute inset-0 h-[32rem] mt-14 flex flex-col justify-center text-center">
                <div className="text-white px-6 md:px-12">
                    <h1 className="text-5xl font-semibold mb-4">We Are Hiring</h1>
                    <p className="text-lg mb-6">Join our team of innovators and make a difference. Explore job opportunities and start your journey with us today!</p>


                    <div className="flex justify-center gap-4">
                        <Link to={"/jobs"} className="bg-red-900 text-white py-3 px-6 rounded-md text-lg hover:bg-red-700 transition">
                            Browse Open Positions
                        </Link>
                        <button
                            onClick={LearnMore}
                            className="bg-transparent border-2 border-white text-white py-3 px-6 rounded-md text-lg hover:bg-white hover:text-blue-600 transition">
                            Learn More About Us
                        </button>
                    </div>
                </div>
            </MaxWidthWrapper>

            {/* Why Work With Us Section */}
            <MaxWidthWrapper className="my-12 px-6 md:px-12">
                <h2 className="text-4xl font-semibold text-center text-gray-900 mb-6">Why Work With Us</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                        <div className="text-blue-600 text-4xl mb-4 flex justify-center">
                            <LightbulbIcon fontSize="inherit" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Innovative Culture</h3>
                        <p className="text-gray-600 text-center">We foster creativity and embrace new ideas, allowing you to bring your best work to life.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                        <div className="text-green-600 text-4xl mb-4 flex justify-center">
                            <TrendingUpIcon fontSize="inherit" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Career Growth</h3>
                        <p className="text-gray-600 text-center">We invest in your growth with mentorship, training, and opportunities to advance your career.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                        <div className="text-yellow-600 text-4xl mb-4 flex justify-center">
                            <BalanceIcon fontSize="inherit" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Work-Life Balance</h3>
                        <p className="text-gray-600 text-center">We value your well-being and offer flexible schedules to support a healthy work-life balance.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                        <div className="text-red-600 text-4xl mb-4 flex justify-center">
                            <Diversity1Icon fontSize="inherit" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Diverse Team</h3>
                        <p className="text-gray-600 text-center">We celebrate diversity and create an inclusive environment where everyone feels valued.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                        <div className="text-purple-600 text-4xl mb-4 flex justify-center">
                            <CardGiftcardIcon fontSize="inherit" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Competitive Benefits</h3>
                        <p className="text-gray-600 text-center">We offer top-tier benefits including health insurance, retirement plans, and paid time off.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                        <div className="text-indigo-600 text-4xl mb-4 flex justify-center">
                            <PublicIcon fontSize="inherit" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Impactful Work</h3>
                        <p className="text-gray-600 text-center">Be part of a team making a real difference in the world through meaningful projects and initiatives.</p>
                    </div>
                </div>
            </MaxWidthWrapper>
            <Footer />
        </div>
    );
}

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

                 <MaxWidthWrapper className="relative h-[36rem] flex flex-row items-center mb-14 bg-white">
                    <div className='relative  w-[50%] lg:mx-20 '>
                      <h3 className='mb-4 text-4xl font-extralight'>
                        Discover Your <span className='decoration-red-800 font-normal underline decoration-4'>Career</span>
                      </h3>
                      <p className='mb-4'>Join our team of innovators and shape the future. Explore exciting opportunities and take the next step in your journey with us.</p>
                      <p className='mb-4'>Become a <span className='text-red-900 font-semibold'>Crypto Warrior</span> today.</p>
                      <div className='absolute w-[120%] xl:text-sm text-xs md:px-6 py-4 rounded-xl flex md:items-center justify-center md:flex-row flex-col z-10  bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>
                        <div className='flex md:h-10 items-center  md:border-r  px-2'>
                          <p className='text-gray-700'>🚀 Accelerate career growth</p>
                        </div>
                        <div className='flex md:h-10 items-center gap-4 md:border-r  px-2'>
                          <p className='text-gray-700'>💡 Innovate technology</p>
                        </div>
                        <div className='flex md:h-10 items-center gap-4 md:border-r   px-2'>
                          <p className='text-gray-700'>👥 Join collaborative team</p>
                        </div>
                        <div className='flex md:h-10 items-center gap-4 md:mt-0 mt-4 px-2'>
                          <Link to="/jobs"
                            className='py-2 px-4 rounded-2xl bg-red-700 hover:bg-red-900 text-white'
                          >Check Now</Link>
                        </div>
                      </div>
          
                    </div>
                    <img
                      src="/IMG_Jobs/job1.jpg"
                      alt="Job Image"
                      className="absolute right-0 h-full w-[44%] object-cover rounded-bl-[14rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
                    />
                  </MaxWidthWrapper>

            {/* Why Work With Us Section */}
            <MaxWidthWrapper className="my-14 px-6 md:px-12">
                <h2 className="md:text-4xl text-2xl font-semibold text-center text-gray-900 mb-6">Why Work With Us</h2>
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

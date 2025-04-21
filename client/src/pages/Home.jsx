import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Footer from '@/components/Footer'
import './home.css'
import { useEffect, useState } from 'react';
import { RocketLaunch, Lightbulb, Groups } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export default function Home() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    async function fetchModulesAndUser() {
      try {

        const modulesRes = await fetch(`${API_URL}/api/module/allModule-storage`);
        const modulesData = await modulesRes.json();

        if (modulesData.listall) {
          const updatedModules = modulesData.listall.map((module) => ({
            ...module,
            file_url: module.file_data ? `data:${module.file_mime_type};base64,${module.file_data}` : null,
          }));

          setModules(updatedModules);
        } else {
          setModules([]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchModulesAndUser();
  }, []);



  return (
    <>
      <div className="mt-14 max-sm:overflow-x-hidden">
        <MaxWidthWrapper className=" w-full flex lg:flex-row sm:flex-col md:flex-row justify-between items-center max-h-screen max-sm:items-center max-sm:justify-center sm:text-center">
          <section className="w-2/4 px-8 mt-12 mb-14 max-sm:text-center max-sm:w-[100%] sm:w-[100%] md:w-2/4 md:text-start motion-preset-slide-left">
            <h2 className="md:text-4xl lg:text-6xl sm:text-3xl mb-4 font-semibold text-[#333333] max-sm:text-3xl">
              Unlock the power of{' '}
              <span className="font-custom text-yellow-600">Blockchain</span>
            </h2>
            <h3 className="md:text-xl lg:text-3xl sm:text-xl font-semibold py-2  mb-8 rounded-3xl max-sm:text-2xl">
              Become a{' '}
              <span className="text-red-900 font-custom ">Crypto Warrior</span>{' '}
              Today
            </h3>
            <p className="mb-12 lg:text-base md:text-sm">
              Explore blockchain with us! Whether you're a beginner or an
              expert, we provide the tools, resources, and a vibrant community
              to help you thrive. Dive into interactive learning modules,
              hands-on demos, and real-world applications. Stay ahead with the
              latest trends, connect with like-minded learners, and unlock new
              opportunities in Web3. Join us today and take your Web3 journey to
              the next level!
            </p>

            <Link
              to="/modules"
              className="md:text-xl text-lg py-3 px-6 rounded-tl-[50px] rounded-tr-[30px] rounded-br-[30px] rounded-bl-[0] bg-red-900 hover:bg-red-950 text-white"
            >
              Get Started
            </Link>
          </section>
          <section className="banner w-2/4 lg:-mr-12 motion-preset-fade">
            <div className="gallery w-full h-auto lg:p-[100px] md:p-[50px] grid grid-cols-3  gap-y-4  mb-20">
              <div className="item row-start-1 row-end-4 animate-move">
                <img
                  src="/IMG_Dashboard/Banner/NFT-Dragon-spitting-fire.jpg"
                  alt="NFT-Dragon-spitting-fire"
                />
              </div>
              <div className="item animate-moveInverse">
                <img
                  src="/IMG_Dashboard/Banner/BLOCKCHAIN-blockchain-technology.jpg"
                  alt="BLOCKCHAIN-blockchain-technology"
                />
              </div>
              <div className="item animate-move">
                <img
                  src="/IMG_Dashboard/Banner/LEARNING-teacher-teaching.jpg"
                  alt="LEARNING-teacher-teaching"
                />
              </div>
              <div className="item animate-move">
                <img
                  src="/IMG_Dashboard/Banner/LEARNING-Book.jpg"
                  alt="LEARNING-Book"
                />
              </div>
              <div className="item row-start-2 row-end-5 animate-moveInverse">
                <img
                  src="/IMG_Dashboard/Banner/CRYPTOCURRENCY-CryptocurrencyWallet-bitcoin-background.jpg"
                  alt="CRYPTOCURRENCY-CryptocurrencyWallet-bitcoin-background"
                />
              </div>
              <div className="item animate-move">
                <img
                  src="/IMG_Dashboard/Banner/NFT-People-smiling-falling-money.jpg"
                  alt="NFT-People-smiling-falling-money"
                />
              </div>
              <div className="item animate-move">
                <img
                  src="/IMG_Dashboard/Banner/NFT-Cat-knight-nature-background.jpg"
                  alt="NFT-Cat-knight-nature-background"
                />
              </div>
              <div className="item row-start-3 row-end-6 animate-move">
                <img
                  src="/IMG_Dashboard/Banner/LEARNING-Person-enlightened-library-background.jpg"
                  alt="LEARNING-Person-enlightened-library-background"
                />
              </div>
              <div className="item animate-moveInverse">
                <img
                  src="/IMG_Dashboard/Banner/BLOCKCHAIN-Decentralization.jpg"
                  alt="BLOCKCHAIN-Decentralization"
                />
              </div>
            </div>
          </section>
        </MaxWidthWrapper>

        {/* PAGE 2 */}
        <section className='w-full bg-[#333333]'>
          <MaxWidthWrapper className="py-10  flex md:flex-row flex-col items-center  ">
            <section className=''>
              <h2 className="md:text-4xl text-2xl font-semibold text-white max-sm:text-xl ">
                <span className="text-red-600">Engage, Learn,</span> and{' '}
                <span className="text-red-600">Earn Confidence</span> in Blockchain
              </h2>
              <p className="md:text-lg text-md mt-1 mb-12 text-[#FEF3C7] max-sm:text-sm">
                Learn Blockchain, Crypto, and NFTs through interactive lessons and comprehension checks—all in one easy-to-use platform.
              </p>

            </section>
            <section className='flex flex-wrap md:gap-4 gap-2 text-xs  justify-center'>
              <div className='h-fit flex flex-row  items-center  gap-2 md:w-44 w-40  md:px-4 px-2 py-2 rounded-xl border border-white text-white'>
                <img
                  className='md:h-10 h-8'
                  src="/IMG_Home/Modules_white.png" alt="" />
                <p >Modules</p>
              </div>
              <div className='h-fit flex flex-row  items-center  gap-2 md:w-44 w-40  md:px-4 px-2 py-2 rounded-xl border border-white text-white'>
                <img
                  className='md:h-10 h-8'
                  src="/IMG_Home/Quiz_white.png" alt="" />
                <p >Quizzes</p>
              </div>
              <div className='h-fit flex flex-row  items-center  gap-2 md:w-44 w-40  md:px-4 px-2 py-2 rounded-xl border border-white text-white'>
                <img
                  className='md:h-10 h-8'
                  src="/IMG_Home/Game_white.png" alt="" />
                <p >Games</p>
              </div>
              <div className='h-fit flex flex-row  items-center  gap-2 md:w-44 w-40  md:px-4 px-2 py-2 rounded-xl border border-white text-white'>
                <img
                  className='md:h-10 h-8'
                  src="/IMG_Home/Demo_white.png" alt="" />
                <p >Demonstration</p>
              </div>
              <div className='h-fit flex flex-row  items-center  gap-2 md:w-44 w-40  md:px-4 px-2 py-2 rounded-xl border border-white text-white'>
                <img
                  className='md:h-10 h-8'
                  src="/IMG_Home/Job_white.png" alt="" />
                <p >Jobs</p>
              </div>
              <div className='h-fit flex flex-row  items-center  gap-2 md:w-44 w-40  md:px-4 px-2 py-2 rounded-xl border border-white text-white'>
                <img
                  className='md:h-10 h-8'
                  src="/IMG_Home/Forum_white.png" alt="" />
                <p >Forum</p>
              </div>
            </section>
          </MaxWidthWrapper>
        </section>

        {/* PAGE 3 */}
        <section className="py-14 ">

          <MaxWidthWrapper className="flex md:flex-row flex-col justify-center items-center text-sm md:gap-4 md:px-28">
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center  text-center">
              <img
                className='h-14 mb-1 '
                src="/IMG_Home/Modules.png" alt="" />
              <h4 className="text-2xl font-semibold text-red-800 mb-2">Web3 Modules</h4>
              <p className="text-gray-600">Master blockchain, crypto, and NFTs through expert-designed modules—simple, structured, and accessible.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center  text-center">
              <img
                className='h-14 mb-1'
                src="/IMG_Home/Quiz.png" alt="" />
              <h4 className="text-2xl font-semibold text-red-800 mb-2">Interactive Quizzes</h4>
              <p className="text-gray-600">Reinforce your knowledge with interactive quizzes—engaging, structured, and designed for mastery.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl flex flex-col items-center  text-center">
              <img
                className='h-14 mb-1'
                src="/IMG_Home/Comprehension.png" alt="" />
              <h4 className="text-2xl font-semibold text-red-800 mb-2">Comprehension Checks</h4>
              <p className="text-gray-600">Wrap up each module with comprehension checks to reinforce key blockchain, crypto, and NFT concepts—simple but effective.</p>
            </div>
          </MaxWidthWrapper>
        </section>

        {/* PAGE 4 */}
        <section className='w-full bg-gray-100'>
          <MaxWidthWrapper className="flex  xl:flex-row flex-col justify-center gap-4  py-14 xl:px-36 lg:px-14 ">
            <h3 className='md:text-4xl text-2xl font-extralight'>New <span className='decoration-red-800 font-normal underline decoration-4 '>free</span> online modules</h3>
            <div className=''>
              <div className="flex sm:flex-row flex-col items-center justify-center gap-4 mb-6 ">
                {
                  modules.length > 0 ? (
                    modules.slice(0, 3).map((module, index) => (
                      <Link
                        to={`/modules/units/${module.id}`}
                        key={index}
                        className="md:h-[24rem] sm:h-[16rem] h-[26rem]  flex flex-col justify-between lg:w-[19rem] md:w-64 sm:w-80 w-full  border border-b-2 border-b-red-800 rounded-xl bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-[1px_0px_20px_2px_rgba(0,_0,_0,_0.1)]"
                      >
                        <div
                          className={`relative flex w-full md:min-h-56 h-full p-2 overflow-hidden rounded-xl text-white transition-all duration-300  "
                                  }`}
                        >
                          {module.file_url && (
                            <img
                              className=" w-full h-full aspect-[20/13] object-cover overflow-hidden rounded-md z-10 transition-transform duration-300 group-hover:scale-105 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                              src={module.file_url}
                              alt={module.name}
                            />
                          )}
                          {module.file_url && (
                            <p
                              className={`md:text-sm text-xs absolute right-3 top-3 text-white px-3 py-1 rounded z-10 capitalize  ${module?.difficulty_level === 'easy'
                                ? 'bg-green-600'
                                : module?.difficulty_level === 'medium'
                                  ? 'bg-yellow-500'
                                  : module?.difficulty_level === 'hard'
                                  && 'bg-red-600'
                                }`}
                            >
                              {module?.difficulty_level}
                            </p>

                          )}
                          {!module.file_url && (
                            <img
                              className={`w-full h-full aspect-[20/13] object-cover overflow-hidden rounded-md z-10 transition-transform duration-300 group-hover:scale-105 ${!module.file_url && "bg-red-950 "}shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                              src="/IMG_Modules/LOGO_white.png"
                              alt={module.name}
                            />
                          )}
                        </div>
                        <div className="h-[50%] p-2 px-3">
                          <img className="md:h-4 md:w-20 h-3 w-18 mb-2" src="/IMG_Modules/LOGO_maroon.png" alt="" />
                          <h2 className="md:h-12 overflow-hidden leading-snug md:font-bold break-words line-clamp-2 z-10 text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {module.name}
                          </h2>
                          <div className=" w-full md:h-14 h-6 flex flex-row flex-wrap  gap-1 overflow-hidden my-2">
                            {module.tags.map((tag, index) => (
                              <p
                                key={index}
                                className="h-fit border px-2 py-1 rounded-lg md:text-[0.6rem] text-[0.45rem] tracking-wide transition-all duration-300 hover:bg-gray-200"
                              >
                                {tag}
                              </p>
                            ))}
                          </div>
                        </div>
                      </Link>

                    ))
                  ) : (
                    <p>No modules available</p>
                  )}
              </div>
              <Link
                onClick={() => setMenu(!menu)}
                to="/modules"
                className=" border text-sm font-medium border-red-700 rounded-md bg-white py-2 px-4"
              >
                More...
              </Link>
            </div>
          </MaxWidthWrapper>
        </section>
        {/* PAGE 5 */}
        <MaxWidthWrapper className="relative h-[36rem] flex flex-row items-center bg-white ">
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
        {/* Partners Section */}
        <section className="relative -top-8 mt-14 pb-8 inline-block w-screen overflow-hidden  max-sm:py-4 max-sm:static">
          <MaxWidthWrapper>
            <div className="flex flex-col justify-center items-center max-w-screen max-sm:w-[96vw] max-sm:overflow-hidden max-sm:h-40">
              <h3 className="text-2xl font-semibold w-fit py-3 px-6 z-10 rounded-2xl text-red-900 mb-4 ">
                Great Minds <span className="text-[#333333]">We Work With</span>
              </h3>
              <section className="partners-container relative top-3 rounded-2xl  flex w-screen max-sm:gap-2 ">
                <div className="flex flex-row justify-between items-center rounded-2xl animate-slide max-sm:gap-2 mx-0">
                  <PartnerCard
                    name="Coins PH"
                    imgSrc="/IMG_Dashboard/Partners/coinsph4.jpg"
                  />
                  <PartnerCard
                    name="University of the Cordilleras"
                    imgSrc="/IMG_Dashboard/Partners/UC.jpg"
                  />

                  <PartnerCard
                    name="DICT CAR"
                    imgSrc="/IMG_Dashboard/Partners/dict10.jpg"
                  />
                  <PartnerCard
                    name="PC Express"
                    imgSrc="/IMG_Dashboard/Partners/pc-express.png"
                  />
                  <PartnerCard
                    name="UC InTTO"
                    imgSrc="/IMG_Dashboard/Partners/uc-intto2.png"
                  />
                  <PartnerCard
                    name="Zodiacs gaming"
                    imgSrc="/IMG_Dashboard/Partners/zodiacs-gaming.jpg"
                  />
                </div>
                <div className="flex flex-row justify-between items-center rounded-2xl  animate-slide mx-0 max-sm:gap-2">
                  <PartnerCard
                    name="Coins PH"
                    imgSrc="/IMG_Dashboard/Partners/coinsph4.jpg"
                  />
                  <PartnerCard
                    name="University of the Cordilleras"
                    imgSrc="/IMG_Dashboard/Partners/UC.jpg"
                  />

                  <PartnerCard
                    name="DICT CAR"
                    imgSrc="/IMG_Dashboard/Partners/dict10.jpg"
                  />
                  <PartnerCard
                    name="PC Express"
                    imgSrc="/IMG_Dashboard/Partners/pc-express.png"
                  />
                  <PartnerCard
                    name="UC InTTO"
                    imgSrc="/IMG_Dashboard/Partners/uc-intto2.png"
                  />
                  <PartnerCard
                    name="Zodiacs gaming"
                    imgSrc="/IMG_Dashboard/Partners/zodiacs-gaming.jpg"
                  />
                </div>
              </section>
            </div>
          </MaxWidthWrapper>
        </section>
        {/* PAGE 6 */}
        <section className=''>
          <MaxWidthWrapper className="lg:h-[38rem] h-fit md:relative py-8 flex lg:flex-row flex-col items-center bg-white">
            <section className="py-8 h-full flex flex-col px-4">
              <h2 className="xl:text-3xl text-2xl font-semibold lg:text-start text-center text-[#333333] mb-4 ">
                <span className="text-red-900">Learn faster</span> and{' '}
                <span className="text-red-900">engage better</span> with blockchain games and simulations.
              </h2>

              <p className="md:text-base text-sm mt-1 lg:text-start text-center ">
                Level up your blockchain knowledge with interactive simulations
                and games—learn by playing, mastering key concepts along the way.
              </p>
            </section>
            <section className=" h-full  flex md:flex-row flex-col  gap-4  ">
              <div className="flex flex-col items-center justify-center ">
                <FeatureCard
                  title="Games"
                  description="Gamify your blockchain learning—test your skills with Don't fall, Web3 Mix n' Match, Guessing Quest, and Typing Speed Challenge"
                  link="/modules"
                  imgSrc="/IMG_Dashboard/Features/games.gif"
                />
                <Link
                  to="/games"
                  className="py-4 px-16 bg-red-700 text-white font-bold text-xl
                rounded-full mt-6 hover:bg-red-900 max-sm:p-2 max-sm:text-sm"
                >
                  Play Games
                </Link>
              </div>

              <div className="flex flex-col items-center justify-center">
                <FeatureCard
                  title="Blockchain Simulation"
                  description="Learn by doing—simulate crowdfunding with smart contracts and understand decentralized finance in real-time."
                  link="/games"
                  imgSrc="/IMG_Dashboard/Features/blockchain.gif"
                />
                <Link
                  to="https://cryptowarriorssimulation.netlify.app/"
                  className="py-4 px-16 bg-red-700 text-white font-bold text-xl rounded-full mt-6 hover:bg-red-900 max-sm:p-2 max-sm:text-sm"
                >
                  Visit Simulation
                </Link>
              </div>
            </section>
          </MaxWidthWrapper>
        </section>
        {/* Footer Section */}
        <Footer />
      </div>
    </>
  )
}

function PartnerCard({ name, imgSrc }) {
  return (
    <div className="flex flex-row items-center md:px-28 px-4 mx-0">
      <img
        className="lg:h-20 w-full h-full object-cover rounded-full max-sm:w-[70%]"
        src={imgSrc}
        alt=""
      />
      <p className="lg:text-xl md:text-lg text-sm text-center max-sm:text-xs">
        {name}
      </p>
    </div>
  )
}
function FeatureCard({ title, description, link, imgSrc }) {
  return (
    <div className="group w-96 flex flex-col items-center h-[400px]">
      <div className="w-[90%] overflow-hidden">
        <img
          src={imgSrc}
          alt=""
          className="w-full rounded-md object-cover transition-transform duration-300 ease-in-out group-hover:scale-125 "
        />
      </div>
      <section className="w-[95%] mt-4 flex md:flex-row flex-col justify-between md:items-center gap-4 ml-4">
        <div>
          <h3 className="md:text-xl font-semibold my-4">{title}</h3>
          <p className="lg:text-base md:text-sm text-xs text-gray-500">
            {description}
          </p>
        </div>
      </section>
    </div>
  )
}

{
  /* <Link
  to={link}
  className="md:py-2 py-1 md:px-4 px-2 md:w-fit w-full text-center rounded-md text-white bg-red-900 hover:bg-red-950"
>
  Visit
</Link> */
}

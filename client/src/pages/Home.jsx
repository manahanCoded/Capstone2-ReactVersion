import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Footer from '@/components/Footer'
import './home.css'
export default function Home() {
  return (
    <>
      <div className="mt-14">
        <MaxWidthWrapper className=" w-full flex lg:flex-row sm:flex-col md:flex-row justify-between items-center max-h-screen max-sm:items-center max-sm:justify-center sm:text-center">
          <section className="w-2/4 px-8 mt-12 mb-14 max-sm:text-center max-sm:w-[100%] sm:w-[100%] md:w-2/4 ">
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
          <section className="banner w-2/4 lg:-mr-12 ">
            {/* <img
              src="/IMG_Dashboard/main.png"
              alt=""
              className="relative lg:left-0 -left-10 rounded md:w-[90%] w-full"
            /> */}
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
        <section className="pt-14 pb-44 bg-gray-100">
          <MaxWidthWrapper className="mb-10 text-center">
            <h2 className="md:text-4xl text-2xl font-semibold text-[#333333]">
              Our <span className="text-red-900">Features</span> Specially For
              You
            </h2>
            <p className="md:text-lg text-md mt-1">
              When Something is easy to read, people might get so caught up in
              it that they mess some of the smaller details.
            </p>
          </MaxWidthWrapper>
          <MaxWidthWrapper className="flex flex-row justify-center items-center md:gap-4">
            <FeatureCard
              title="Modules"
              description="10 Modules 12 lessons"
              link="/modules"
              imgSrc="/IMG_Dashboard/Features/modules.jpg"
            />
            <FeatureCard
              title="Games"
              description="4 Games"
              link="/games"
              imgSrc="/IMG_Dashboard/Features/demos.jpg"
            />
            <FeatureCard
              title="Jobs"
              description="Find Job"
              link="/jobs"
              imgSrc="/IMG_Dashboard/Features/question.jpg"
            />
          </MaxWidthWrapper>
        </section>

        {/* Partners Section */}
        <section className="relative -top-12 pt-14 inline-block w-screen">
          <MaxWidthWrapper>
            <div className="flex flex-col justify-center items-center">
              <h3 className="w-fit py-3 px-6 z-10 rounded-2xl text-red-900 font-bold text-3xl">
                Great Minds <span className="text-[#333333]">We Work With</span>
              </h3>
              <section className="partners-container relative top-3 bg-white rounded-2xl  flex w-screen gap-0 ">
                <div className="flex flex-row justify-between items-center rounded-2xl animate-slide mx-0">
                  <PartnerCard
                    name="Coins PH"
                    imgSrc="/IMG_Dashboard/Partners/coinsph2.jpg"
                  />
                  <PartnerCard
                    name="University of Cordilleras"
                    imgSrc="/IMG_Dashboard/Partners/UC.jpg"
                  />

                  <PartnerCard
                    name="DICT CAR"
                    imgSrc="/IMG_Dashboard/Partners/dict2.jpg"
                  />
                  <PartnerCard
                    name="PC Express"
                    imgSrc="/IMG_Dashboard/Partners/pc-express.png"
                  />
                  <PartnerCard
                    name="UC InTTO"
                    imgSrc="/IMG_Dashboard/Partners/uc-intto.jpg"
                  />
                  <PartnerCard
                    name="Zodiacs gaming"
                    imgSrc="/IMG_Dashboard/Partners/zodiacs-gaming.jpg"
                  />
                </div>
                <div className="flex flex-row justify-between items-center rounded-2xl  animate-slide mx-0">
                  <PartnerCard
                    name="Coins PH"
                    imgSrc="/IMG_Dashboard/Partners/coinsph2.jpg"
                  />
                  <PartnerCard
                    name="University of the Cordilleras"
                    imgSrc="/IMG_Dashboard/Partners/UC.jpg"
                  />

                  <PartnerCard
                    name="DICT CAR"
                    imgSrc="/IMG_Dashboard/Partners/dict6.png"
                  />
                  <PartnerCard
                    name="PC Express"
                    imgSrc="/IMG_Dashboard/Partners/pc-express.png"
                  />
                  <PartnerCard
                    name="UC InTTO"
                    imgSrc="/IMG_Dashboard/Partners/uc-intto.jpg"
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
        className="lg:h-20 w-full h-full object-cover rounded-full"
        src={imgSrc}
        alt=""
      />
      <p className="lg:text-xl md:text-lg text-sm text-center">{name}</p>
    </div>
  )
}
function FeatureCard({ title, description, link, imgSrc }) {
  return (
    <div className="group w-96 flex flex-col items-center">
      <div className="w-[90%] overflow-hidden">
        <img
          src={imgSrc}
          alt=""
          className="w-full rounded-md object-cover transition-transform duration-300 ease-in-out group-hover:scale-125"
        />
      </div>
      <section className="w-[90%] mt-4 flex md:flex-row flex-col justify-between md:items-center gap-4">
        <div>
          <h3 className="md:text-xl font-semibold">{title}</h3>
          <p className="lg:text-base md:text-sm text-xs text-gray-500">
            {description}
          </p>
        </div>
        <Link
          to={link}
          className="md:py-2 py-1 md:px-4 px-2 md:w-fit w-full text-center rounded-md text-white bg-red-900 hover:bg-red-950"
        >
          Visit
        </Link>
      </section>
    </div>
  )
}

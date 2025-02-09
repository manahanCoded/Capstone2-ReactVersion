import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Footer from "@/components/Footer";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home() {

  console.log(API_URL)
  return (
    <>

      <div className="mt-14">
        <MaxWidthWrapper className="mb-14 w-full flex lg:flex-row flex-col justify-between items-center">
          <section className="w-full px-8 mt-8 mb-14">
            <h2 className="md:text-5xl text-4xl mb-4 font-semibold text-[#333333]">
              Unlock the power of Blockchain
            </h2>
            <h3 className="md:text-2xl text-xl font-semibold py-2 px-6 mb-8 rounded-3xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              Become a <span className="text-red-900">Crypto Warrior</span> Today
            </h3>
            <p className="mb-12">
              Explore blockchain. Whether you’re a beginner or expert, we
              provide the tools and community to help you thrive. Start your
              web3 journey here!
            </p>
            <Link
              to="/modules"
              className="md:text-xl text-lg py-3 px-6 rounded-3xl bg-red-900 hover:bg-red-950 text-white"
            >
              Get Started
            </Link>
          </section>
          <section className="w-full mt-6 flex md:justify-center justify-start">
            <img
              src="/IMG_Dashboard/main.png"
              alt=""
              className="relative lg:left-0 -left-10 rounded md:w-[90%] w-full"
            />
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
        <section className="relative -top-36 pt-14">
          <MaxWidthWrapper>
            <div className="flex flex-col justify-center items-center">
              <h3 className="w-fit py-3 px-6 z-10 rounded-2xl text-white bg-[#333333]">
                Partners
              </h3>
              <section className="relative -top-4 bg-white rounded-2xl">
                <div className="flex flex-row justify-center items-center py-4 lg:px-8 rounded-2xl shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
                  <PartnerCard
                    name="Crypto Warriors"
                    imgSrc="/IMG_Dashboard/Partners/cryptoWarriors.jpg"
                  />
                  <PartnerCard
                    name="University of Cordilleras"
                    imgSrc="/IMG_Dashboard/Partners/UC.jpg"
                  />
                  <PartnerCard
                    name="Chain Academy"
                    imgSrc="/IMG_Dashboard/Partners/UC.jpg"
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
  );
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
  );
}

function PartnerCard({ name, imgSrc }) {
  return (
    <div className="flex flex-row items-center gap-2 md:py-4 md:px-12 px-4 py-2 border-r-2">
      <img
        className="md:h-12 h-10 rounded-full"
        src={imgSrc}
        alt=""
      />
      <p className="lg:text-xl md:text-lg text-sm">{name}</p>
    </div>
  );
}



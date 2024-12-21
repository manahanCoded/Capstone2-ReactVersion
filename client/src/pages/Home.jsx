import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";


export default function Home() {
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
              title="Forum"
              description="Find Job"
              link="/forum"
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


function Footer() {
  return (
    <MaxWidthWrapper className="text-sm bg-gray-100">
      <div className="w-full mx-auto">
        <section className="pt-12 pb-8 flex justify-center items-center border-t-2">
          <form className="flex flex-row items-center  md:p-8 p-4 md:gap-8 gap-4">
            <img
              className="md:h-14 h-12"
              src="https://substackcdn.com/image/fetch/w_96,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F051da1ed-7e17-4ab0-9645-3510a8958a7a_1000x1000.png"
              alt="Crypto Warriors Logo"
            />
            <div className="flex flex-row items-center">
              <input
                className="h-10 py-2 px-4 border border-r-0 rounded-l-md"
                placeholder="Get Updates"
                type="email"
              />
              <button className="h-10 py-1 px-2 rounded-r-md text-white bg-red-900">
                Subscribe Now
              </button>
            </div>
          </form>
        </section>

        <div className="h-14 flex flex-row justify-between items-center bg-gray-100 md:text-sm text-xs">
          <a href="/" className="">
            <p>&copy;2024 cryptowarriors.com</p>
          </a>

          <div className="flex flex-row items-center md:gap-8 gap-2">
            <a
              href="/"
              className="cursor-pointer hover:underline decoration-2"
            >
              Legal Terms
            </a>
            <a
              href="/"
              className="cursor-pointer hover:underline decoration-2"
            >
              Terms and Conditions
            </a>
            <a
              href="/"
              className="cursor-pointer hover:underline decoration-2"
            >
              Privacy Policy
            </a>
          </div>

          <div className="flex flex-row items-center md:gap-4 gap-1">
            <a href="https://www.facebook.com/CryptoWarriors111">
              <img
                className="md:h-8 h-6"
                src="/Icons/facebook.png"
                alt="Facebook"
              />
            </a>
            <a href="https://www.linkedin.com/company/cwarriorsph/">
              <img
                className="md:h-8 h-6"
                src="/Icons/linkedin.png"
                alt="LinkedIn"
              />
            </a>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
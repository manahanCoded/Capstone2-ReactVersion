import MaxWidthWrapper from "./MaxWidthWrapper";

export default function Footer() {
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
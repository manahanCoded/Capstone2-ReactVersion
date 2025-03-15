import MaxWidthWrapper from "./MaxWidthWrapper";

export default function Footer() {
    return (
      <div className="text-sm bg-gray-100">
        <MaxWidthWrapper className="w-full mx-auto">
          <section className="pt-12 pb-8 flex justify-center items-center ">
            
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
        </MaxWidthWrapper>
      </div>
    );
  }
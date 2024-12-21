import React, { useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const submit_Login = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
      credentials: "include",
    });
    if (!response.ok) {
      alert("Log in failed");
    } else {
      // Simulate navigation (React Router example)
      window.location.href = "/";
    }
  };

  return (
    <div className=" h-screen overflow-hidden">
      <img
        className="h-screen w-screen select-none object-cover"
        src="/IMG_Auth/BG_auth.jpg"
        alt=""
      />
      <MaxWidthWrapper>
        <div className="mt-8 fixed md:px-0 px-8 inset-0 md:w-[70%] h-full m-auto z-10 flex justify-center items-center">
          <form
            onSubmit={submit_Login}
            className="w-full h-[90%] grid grid-flow-col lg:grid-col-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden"
          >
            <section className="px-12 py-8 text-white bg-[#333333] hidden lg:block">
              <h1 className="text-4xl font-semibold mb-8">Crypto Warriors</h1>
              <p>
                In the world of web3, you are in charge! By signing in, you're
                embracing a new way of learning—decentralized, empowering, and
                built for innovators like you. Register today and unlock the
                skills that will drive the future of blockchain and beyond!
              </p>
            </section>
            <section className="px-12 py-8 bg-zinc-50 flex justify-between flex-col">
              <div className="flex flex-col">
                <h2 className="text-2xl text-center mb-8">WELCOME</h2>
                {/* Input Section */}
                <label className="mt-3">Email</label>
                <input
                  required
                  type="email"
                  placeholder="abc@gmail.com"
                  value={user.email}
                  onChange={(e) => {
                    setUser({ ...user, email: e.target.value });
                  }}
                  className="md:h-10 h-8 rounded mb-2 px-2 border shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                />
                <label className="mt-3">Password</label>
                <input
                  required
                  type="password"
                  placeholder="***********"
                  value={user.password}
                  onChange={(e) => {
                    setUser({ ...user, password: e.target.value });
                  }}
                  className="md:h-10 h-8 rounded mb-2 px-2 border shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                />
                <div className="flex items-center gap-1">
                  <input
                    required
                    type="checkbox"
                    className="h-10 cursor-pointer"
                  />
                  <label className="text-xs">
                    I've read and agree with terms of service and our privacy
                    policy
                  </label>
                </div>
                <input
                  required
                  type="submit"
                  className="md:h-10 h-8 rounded mb-2 mt-6 px-2 cursor-pointer bg-red-700 text-white hover:bg-red-900"
                />
                <a
                  href="http://localhost:5000/api/user/auth/google"
                  className="md:h-10 h-8 rounded mb-2 mt-6 px-2 flex items-center justify-center cursor-pointer bg-[#333333] text-white hover:bg-black"
                >
                  <img
                    src="/IMG_Auth/google.png"
                    className="h-6 mr-2"
                    alt="Google Icon"
                  />
                  Or sign in with Google
                </a>
              </div>
              <div className="flex justify-between items-center">
                <a
                  href="/"
                  className="flex justify-center items-center group"
                >
                  <span className="group-bg-slate-200 p-1 rounded mr-1 group-hover:bg-slate-300 transition">
                    <ArrowBackIcon />
                  </span>
                  <p className="group-hover:border-b group-hover:text-red-950 border-red-950 transition">
                    Go back
                  </p>
                </a>
                <a
                  href="/user/register"
                  className="w-28 p-1 bg-gray-200 hover:rounded hover:text-white hover:bg-red-700 transition text-center"
                >
                  Sign Up
                </a>
              </div>
            </section>
          </form>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default Login;

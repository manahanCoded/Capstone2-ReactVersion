import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
import axios from "axios";
export default function Login() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
  const checkLogin = async () => {
    try {
      const { data } = await axios.get(`https://cryptowarriors-be.onrender.com/api/user/profile`, {
        withCredentials: true,
      });

      if (data.id) {
        navigate("/");
      } else {
        console.log("User not logged in");
      }
    } catch (error) {
      console.log("Error checking login:", error);
    }
  };

  checkLogin();
}, [navigate]);

const submit_Login = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { data } = await axios.post(`https://cryptowarriors-be.onrender.com/api/user/login`, user, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    navigate("/");
  } catch (error) {
    console.error("Login Error:", error);
    
    if (error.response) {
      const { errors, error: errorMsg } = error.response.data;

      if (errors) {
        alert(errors.map((err) => err.msg).join("\n"));
      } else if (errorMsg) {
        alert(errorMsg);
      } else {
        alert("An unexpected error occurred.");
      }
    } else {
      alert("Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className=" h-screen overflow-hidden">
      <img
        className="h-screen w-screen select-none object-cover"
        src="/IMG_Auth/BG_auth.jpg"
      />
      <MaxWidthWrapper>
        <div className="mt-8 fixed md:px-0 px-8 inset-0 md:w-[70%] h-full m-auto z-10 flex justify-center items-center ">
          <form
            onSubmit={submit_Login}
            className="xl:w-fit w-full h-[90%] flex flex-row overflow-hidden bg-[#333333] "
          >
            <section className="w-[35%] px-12 py-8 text-white hidden lg:block">
              <img src="/IMG_Auth/CW_icon.png"
                className="h-56"
                alt="" />
              <h1 className="text-3xl font-semibold mb-4">Become a <span className="text-red-600">Crypto Warrior </span>Today</h1>
              <p className="text-sm">Unlock your learning journey! Sign in or register to access educational resources and courses.</p>
            </section>
            <section className="lg:w-[65%] w-full  py-8 lg:px-32 px-12  bg-white flex justify-between flex-col lg:rounded-l-3xl ">
              <div className="flex flex-col justify-between">
                <h2 className="text-4xl font-bold mb-4">Log in to your Account</h2>
                {/* Input Section */}
                <div className="flex flex-col  mt-14 mb-4">
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => {
                      setUser({ ...user, email: e.target.value });
                    }}
                    className="md:h-10 h-8 rounded  px-2 border mb-4"
                  />

                  <input
                    required
                    type="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) => {
                      setUser({ ...user, password: e.target.value });
                    }}
                    className="md:h-10 h-8 rounded  px-2 border mb-4"
                  />
                  <div className="w-full flex items-center justify-end text-red-700 hover:undeline text-sm mb-4">
                    <Link to="/user/retrieve">Forgot Password?</Link>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-red-700 hover:bg-red-900 text-white p-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  <Link
                    to={`${API_URL}/api/user/auth/google`}
                    className="md:h-10 h-8 rounded mb-2 mt-2 px-2 flex items-center justify-center cursor-pointer bg-[#333333] text-white hover:bg-black"
                  >
                    <img src="/IMG_Auth/google.png" className="h-6 mr-2" alt="Google logo" />
                    Or sign up with Google
                  </Link>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Link
                  to="/user/register"
                  className=""
                >
                  Don’t have an account ? <span className="text-red-900">Sign Up</span>
                </Link>
              </div>
            </section>
          </form>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}



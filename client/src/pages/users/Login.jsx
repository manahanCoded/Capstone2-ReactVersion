import { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Link, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/user/profile`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok && data.id) {
          navigate("/");
        }
      } catch {
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [navigate]);

  const submit_Login = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Clear previous errors
    setErrors({
      email: "",
      password: "",
      general: ""
    });

    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Handle validation errors
          const newErrors = {};
          data.errors.forEach(error => {
            if (error.path === 'email') newErrors.email = error.msg;
            if (error.path === 'password') newErrors.password = error.msg;
          });
          setErrors(newErrors);
        } else if (data.error) {
          // Handle general errors (like invalid credentials)
          setErrors(prev => ({
            ...prev,
            general: data.error
          }));
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrors(prev => ({
        ...prev,
        general: "Something went wrong. Please try again."
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <img
        className="h-screen w-screen select-none object-cover"
        src="/IMG_Auth/BG_auth.jpg"
        alt="Background"
      />
      <MaxWidthWrapper>
        <div className="mt-8 fixed md:px-0 px-8 inset-0 md:w-[70%] h-full m-auto z-10 flex justify-center items-center">
          <form
            onSubmit={submit_Login}
            className="xl:w-fit w-full h-[90%] flex flex-row overflow-hidden bg-[#333333]"
          >
            <section className="w-[35%] px-12 py-8 text-white hidden lg:block">
              <img src="/IMG_Auth/CW_icon.png" className="h-56" alt="" />
              <h1 className="text-3xl font-semibold mb-4">
                Become a <span className="text-red-600">Crypto Warrior</span> Today
              </h1>
              <p className="text-sm">
                Unlock your learning journey! Sign in or register to access educational resources and courses.
              </p>
            </section>
            {loading ? (
              <section className="lg:w-[65%] w-full py-8 lg:px-32 md:px-6 px-4 bg-white flex  flex-col justify-center items-center lg:rounded-l-3xl">
                <h2 className="text-4xl font-bold mb-4">Log in to your Account</h2>
                <div className="animate-spin h-16 w-16 border-4 border-red-500 border-t-transparent rounded-full"></div>
                <p className="mt-6">Please wait server is warming up...</p>
              </section>
            ) : (
              <section className="lg:w-[65%] w-full py-8 lg:px-32 md:px-6 px-4 bg-white flex justify-between flex-col lg:rounded-l-3xl">
                <div className="flex flex-col justify-between">
                  <h2 className="text-4xl font-bold mb-4">Log in to your Account</h2>
                  
                  {/* General Error Display */}
                  {errors.general && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                      {errors.general}
                    </div>
                  )}
                  
                  {/* Input Section */}
                  <div className="flex flex-col mt-14 mb-4">
                    <div className="mb-4">
                      <input
                        required
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) => {
                          const noSpaces = e.target.value.replace(/\s/g, "");
                          setUser({ ...user, email: noSpaces });
                          // Clear error when user types
                          if (errors.email) {
                            setErrors(prev => ({ ...prev, email: "" }));
                          }
                        }}
                        className={`md:h-10 h-8 rounded px-2 border w-full ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <input
                        required
                        type="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={(e) => {
                          const noSpaces = e.target.value.replace(/\s/g, "");
                          setUser({ ...user, password: noSpaces });
                          // Clear error when user types
                          if (errors.password) {
                            setErrors(prev => ({ ...prev, password: "" }));
                          }
                        }}
                        className={`md:h-10 h-8 rounded px-2 border w-full ${errors.password ? "border-red-500" : ""}`}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>
                    
                    <div className="w-full flex items-center justify-end text-red-700 hover:underline text-sm mb-4">
                      <Link to="/user/retrieve">Forgot Password?</Link>
                    </div>
                    
                    {/* Login Button */}
                    <button
                      type="submit"
                      className={`md:h-10 h-8 rounded mb-2 mt-3 px-2 cursor-pointer text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-red-700 hover:bg-red-900"}`}
                      disabled={loading}
                    >
                      Login
                    </button>
                    

                    <Link
                      to={`${API_URL}/api/user/auth/google`}
                      className="md:h-10 h-8 rounded mb-2 mt-2 px-2 flex items-center justify-center cursor-pointer bg-[#333333] text-white hover:bg-black"
                    >
                      <img src="/IMG_Auth/google.png" className="h-6 mr-2" alt="Google logo" />
                      Or sign in with Google
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Link to="/user/register">
                    Don't have an account? <span className="text-red-900">Sign Up</span>
                  </Link>
                </div>
              </section>
            )}
          </form>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
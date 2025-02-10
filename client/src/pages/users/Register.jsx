import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const API_URL = import.meta.env.VITE_API_URL

export default function Register() {
  const [user, setUser] = useState({
    name: "",
    lastname: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();


  useEffect(() => {
    const checkLogin = async () => {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.id) {
        navigate("/");
      } else {
        console.log("User not logged in");
      }
    };

    checkLogin();
  }, [navigate]);

  const submit_Register = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }


    if (!user.email || !user.password || !user.confirmPassword) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = data.errors.map((error) => error.msg).join("\n");
          alert(`${errorMessages}`);
        } else if (data.error) {
          alert(data.error);
        } else {
          alert("Registration failed. Internal server Error");
        }

      } else {
        if (data.loggedIn) {
          alert("Registration successful!");
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <img
        className="h-screen w-screen select-none object-cover"
        src="/IMG_Auth/BG_auth.jpg"
      />
      <MaxWidthWrapper>
        <div className="mt-8 fixed md:px-0 px-8 inset-0 md:w-[70%] h-full m-auto z-10 flex justify-center items-center ">
          <form
            onSubmit={submit_Register}
            className="w-fit h-[90%] flex flex-row overflow-hidden bg-[#333333] "
          >
            <section className="w-[35%] px-12 py-8 text-white hidden lg:block">
              <img src="/IMG_Auth/CW_icon.png"
                className="h-56"
                alt="" />
              <h1 className="text-3xl font-semibold mb-4">Become a <span className="text-red-600">Crypto Warrior </span>Today</h1>
              <p className="text-sm">Unlock your learning journey! Sign in or register to access educational resources and courses.</p>
            </section>

            <section className="lg:w-[65%] w-full py-8 lg:px-32 px-12  bg-white flex justify-between flex-col lg:rounded-l-3xl">
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold mb-4">Create Account</h2>
                <div className="w-full flex flex-row items-center justify-between  mt-3 mb-4">
                  <input
                    required
                    type="text"
                    placeholder="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-[48%] md:h-10 h-8 rounded  px-2 border "
                  />
                  <input
                    required
                    type="text"
                    placeholder="Last name"
                    value={user.lastname}
                    onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                    className="w-[48%] md:h-10 h-8 rounded  px-2 border "
                  />
                </div>
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="md:h-10 h-8 rounded  px-2 border mb-4"
                />
                <input
                  required
                  type="tel"
                  placeholder="Mobile number"
                  value={user.phone_number}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "");
                    setUser({ ...user, phone_number: onlyNumbers });
                  }}
                  className="md:h-10 h-8 rounded px-2 border mb-4"
                />
                <input
                  id="password"
                  required
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  className="md:h-10 h-8 rounded  px-2 border mb-4"
                />
                <input
                  id="confirmPassword"
                  required
                  type="password"
                  placeholder="Confrim password"
                  value={user.confirmPassword}
                  onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                  className="md:h-10 h-8 rounded  px-2 border mb-4"
                />
                <div className="flex items-center gap-1">
                  <input
                    required
                    type="checkbox"
                    className="h-10 cursor-pointer"
                  />
                  <label className="text-xs">
                    I&apos;ve read and agree with terms of service and our privacy policy
                  </label>
                </div>
                <input
                  required
                  type="submit"
                  className="md:h-10 h-8 rounded mb-2 mt-3 px-2 cursor-pointer bg-red-700 text-white hover:bg-red-900"
                />
                <Link
                  to={`${API_URL}/api/user/auth/google`}
                  className="md:h-10 h-8 rounded mb-2 mt-2 px-2 flex items-center justify-center cursor-pointer bg-[#333333] text-white hover:bg-black"
                >
                  <img src="/IMG_Auth/google.png" className="h-6 mr-2" alt="Google logo" />
                  Or sign up with Google
                </Link>
              </div>
              <div className="">
                <Link
                  to="/user/login"
                  className=""
                >
                  Already have an account ? <span className="text-red-900">Login Up</span>
                </Link>
              </div>
            </section>
          </form>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register() {
  const [user, setUser] = useState({
    name: "",
    lastname: "",
    phone_number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [inputCode, setInputcode] = useState({
    email: "",
    code: ""
  });

  const [openCode, setOpenCode] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success', 'error', 'warning', 'info'
  });
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.id) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLogin();
  }, [navigate]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateEmailStep = () => {
    const newErrors = {};
    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCodeStep = () => {
    const newErrors = {};
    if (!inputCode.code.trim()) {
      newErrors.code = "Verification code is required";
    } else if (!/^\d{6}$/.test(inputCode.code)) {
      newErrors.code = "Code must be 6 digits and integer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!user.name.trim()) newErrors.name = "Name is required";
    if (!user.lastname.trim()) newErrors.lastname = "Last name is required";
    if (!user.phone_number.trim()) newErrors.phone_number = "Phone number is required";
    if (!user.email.trim()) newErrors.email = "Email is required";
    if (!user.password) newErrors.password = "Password is required";
    if (!user.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    
    if (user.password && user.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!validateEmailStep()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/email-set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
        credentials: "include",
      });

      if (response.ok) {
        setOpenCode(true);
        setInputcode({ ...inputCode, email: user.email });
        setSnackbar({
          open: true,
          message: "Verification code sent to your email",
          severity: "success",
        });
      } else {
        const data = await response.json();
        setSnackbar({
          open: true,
          message: data.error || "Failed to send verification code",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      setSnackbar({
        open: true,
        message: "Verification code error",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (!validateCodeStep()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/user/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputCode),
        credentials: "include",
      });

      if (response.ok) {
        setVerificationSuccess(true);
        setTimeout(() => {
          setOpenForm(true);
          setVerificationSuccess(false);
        }, 1500);
      } else {
        const data = await response.json();
        setSnackbar({
          open: true,
          message: data.error || "Invalid verification code",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setSnackbar({
        open: true,
        message: "Network error. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
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
          setSnackbar({
            open: true,
            message: errorMessages,
            severity: "error",
          });
        } else if (data.error) {
          setSnackbar({
            open: true,
            message: data.error,
            severity: "error",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Registration failed. Please try again.",
            severity: "error",
          });
        }
      } else {
        if (data.loggedIn) {
          setSnackbar({
            open: true,
            message: "Registration successful! Redirecting...",
            severity: "success",
          });
          setTimeout(() => navigate("/"), 2000);
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
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
            onSubmit={openForm ? submitRegister : openCode ? verifyCode : sendEmail}
            className="w-fit h-[90%] flex flex-row overflow-hidden bg-[#333333] shadow-xl"
          >
            <section className="w-[35%] px-12 py-8 text-white hidden lg:block">
              <img 
                src="/IMG_Auth/CW_icon.png"
                className="h-56"
                alt="Crypto Warrior Logo" 
              />
              <h1 className="text-3xl font-semibold mb-4">
                Become a <span className="text-red-600">Crypto Warrior </span>Today
              </h1>
              <p className="text-sm">
                Unlock your learning journey! Sign in or register to access educational resources and courses.
              </p>
            </section>

            {openForm ? (
              <section className="lg:w-[65%] w-full py-8 lg:px-32 md:px-6 px-4 bg-white flex justify-between flex-col lg:rounded-l-3xl">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold mb-6">Create Account</h2>
                  
                  <div className="w-full flex flex-row items-center justify-between mb-4">
                    <div className="w-[48%]">
                      <input
                        type="text"
                        placeholder="Name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value.trimStart() })}
                        className={`w-full md:h-10 h-8 rounded px-2 border ${errors.name ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="w-[48%]">
                      <input
                        type="text"
                        placeholder="Last name"
                        value={user.lastname}
                        onChange={(e) => setUser({ ...user, lastname: e.target.value.trimStart() })}
                        className={`w-full md:h-10 h-8 rounded px-2 border ${errors.lastname ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="tel"
                      placeholder="Mobile number"
                      value={user.phone_number}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "");
                        setUser({ ...user, phone_number: onlyNumbers });
                      }}
                      className={`w-full md:h-10 h-8 rounded px-2 border ${errors.phone_number ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value.trimStart() })}
                      className={`w-full md:h-10 h-8 rounded px-2 border ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={user.confirmPassword}
                      onChange={(e) => setUser({ ...user, confirmPassword: e.target.value.trimStart() })}
                      className={`w-full md:h-10 h-8 rounded px-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-6">
                    <input
                      required
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer"
                    />
                    <label className="text-xs">
                      I've read and agree with terms of service and our privacy policy
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="md:h-10 h-8 rounded mb-2 mt-3 px-2 flex items-center justify-center cursor-pointer bg-red-700 text-white hover:bg-red-900 disabled:bg-red-400"
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Register"}
                  </button>
                  
                  <Link
                    to={`${API_URL}/api/user/auth/google`}
                    className="md:h-10 h-8 rounded mb-2 mt-2 px-2 flex items-center justify-center cursor-pointer bg-[#333333] text-white hover:bg-black"
                  >
                    <img src="/IMG_Auth/google.png" className="h-6 mr-2" alt="Google logo" />
                    Or sign up with Google
                  </Link>
                </div>
                
                <div className="text-center">
                  <Link
                    to="/user/login"
                    className="text-gray-600 hover:text-red-900"
                  >
                    Already have an account? <span className="text-red-900 font-medium">Log In</span>
                  </Link>
                </div>
              </section>
            ) : openCode ? (
              <div className="lg:w-[65%] w-full py-8 lg:px-32 md:px-6 px-4 bg-white flex justify-between flex-col lg:rounded-l-3xl">
                <h2 className="text-2xl font-semibold mb-6">Verify Your Email</h2>
                
                {verificationSuccess ? (
                  <div className="flex flex-col items-center justify-center flex-grow">
                    <CheckCircleOutlineIcon className="text-green-500 text-6xl mb-4" />
                    <p className="text-lg font-medium">Email verified successfully!</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-4">
                        We've sent a 6-digit verification code to <span className="font-medium">{inputCode.email}</span>. 
                        Please enter it below.
                      </p>
                      
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Enter verification code"
                          value={inputCode.code}
                          onChange={(e) => setInputcode({ ...inputCode, code: e.target.value })}
                          className={`w-full md:h-10 h-8 rounded px-2 border ${errors.code ? "border-red-500" : "border-gray-300"}`}
                          maxLength={6}
                        />
                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setOpenCode(false);
                          setErrors({});
                        }}
                        className="text-sm text-gray-600 hover:text-red-900"
                      >
                        <ArrowBackIcon className="mr-1" fontSize="small" />
                        Use a different email
                      </button>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="md:h-10 h-8 rounded mb-2 px-2 cursor-pointer bg-red-700 text-white hover:bg-red-900 disabled:bg-red-400 flex items-center justify-center"
                    >
                      {loading ? <CircularProgress size={20} color="inherit" /> : "Verify Code"}
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-4">
                      Didn't receive the code? <button 
                        type="button" 
                        onClick={sendEmail}
                        className="text-red-700 hover:underline"
                      >
                        Resend code
                      </button>
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="lg:w-[65%] w-full py-8 lg:px-32 md:px-6 px-4 bg-white flex justify-between flex-col lg:rounded-l-3xl">
                <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    We'll send a verification code to your email to confirm it's you.
                  </p>
                  
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value.trimStart() })}
                      className={`w-full md:h-10 h-8 rounded px-2 border ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="flex flex-col ">
                <button
                  type="submit"
                  disabled={loading}
                  className="md:h-10 h-8 rounded mb-2 px-2 cursor-pointer bg-red-700 text-white hover:bg-red-900 disabled:bg-red-400 flex items-center justify-center"
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : "Send Verification Code"}
                </button>
                <Link
                    to={`${API_URL}/api/user/auth/google`}
                    className="md:h-10 h-8 rounded mb-2 mt-2 px-2 flex items-center justify-center cursor-pointer bg-[#333333] text-white hover:bg-black"
                  >
                    <img src="/IMG_Auth/google.png" className="h-6 mr-2" alt="Google logo" />
                    Or sign up with Google
                  </Link>
                  </div>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/user/login" className="text-red-700 hover:underline">
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </MaxWidthWrapper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
// components/authpage.js
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { loginSchema, signupSchema, forgotPasswordSchema } from "../lib/zodSchemas/userSchema";
import Image from "next/image";
const AuthPage = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Form data states
  const [loginData, setLoginData] = useState({email:"", password: "" });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
   
    password: ""
  });
  const [forgetData, setForgetData] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
console.log(loginData)
    try {
      // Validate form data with Zod
      const validatedData = loginSchema.parse(loginData);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      });
      const result = await response.json();

      if (result.success) {
        // Store token and user data
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        router.push('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      if (error.errors) {
        // Zod validation errors
        setError(error.errors[0].message);
      } else {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    // Validate form data with Zod
    const validatedData = signupSchema.parse(registerData);

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData)
    });

    const result = await response.json();

    if (result.success) {
      // ✅ Store pending signup data in localStorage
      localStorage.setItem("pendingSignup", JSON.stringify(registerData));

      // Redirect to OTP page
      router.push('/otp');
    } else {
      setError(result.message || 'Registration failed');
    }
  } catch (error) {
    if (error.errors) {
      // Zod validation errors
      setError(error.errors[0].message);
    } else {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};


  const handleForgetSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form data with Zod
      const validatedData = forgotPasswordSchema.parse(forgetData);

      const response = await fetch('/api/auth/resetpasstoken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      });
      const result = await response.json();

      if (result.success) {
        alert('Password reset link sent to your email!');
        setActiveForm("login");
      } else {
        setError(result.message || 'Failed to send reset link');
      }
    } catch (error) {
      if (error.errors) {
        // Zod validation errors
        setError(error.errors[0].message);
      } else {
        console.error('Password reset error:', error);
        setError('Failed to send reset link. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className={`relative w-screen h-screen shadow-md bg-black overflow-hidden flex justify-center items-center
        ${activeForm === "register" ? "active" : ""}
        ${activeForm === "forget" ? "forget" : ""}`}
    >
      {/* curved shapes */}
      <div
        className="absolute right-0 top-0 w-[1200px] h-[1200px] border-[3.5px] border-[#5827d4]"
        style={{
          background: "linear-gradient(45deg, #230a4a, #480e9f, #7c49c9)",
          transform:  "rotate(10deg) skewY(40deg)",
          transformOrigin: "bottom right",
          transition: "0.7s ease",
        }}
      ></div>

      <div
        className="absolute left-[-280px] top-full w-[1200px] h-[1300px] border-t-[3.5px] bg-black"
        style={{
          transform:  "rotate(0deg) skewY(0deg)",
          transformOrigin: "bottom left",
          transition: "0.7s ease",
        }}
      ></div>
<div
  className={`absolute top-0 left-0 w-full md:w-2/5 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-[70px]
  ${activeForm !== "login" ? "hidden" : ""}`}
>
  <h2 className="text-white font-extrabold text-3xl sm:text-4xl text-center">Login</h2>

<form onSubmit={handleLoginSubmit} className="mt-8 space-y-6">
  {/* Error Message */}
  {error && (
    <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-3">
      {error}
    </div>
  )}

 {/* userid */}
 <div className="w-full">
    <label className="block text-white text-md font-bold mb-2">
    Email
    </label>
    <div className="flex items-center border-b-2 border-white/40 px-3 py-2 focus-within:border-[#8e4eed] transition">
      <input
        type="text"
        required
        value={loginData.email}
        onChange={(e) =>
          setLoginData({ ...loginData, email: e.target.value })
        }
        placeholder="Enter your email"
        className="flex-1 bg-black outline-none text-white text-base"
      />
      <Image
        src="/assets/usernam_icon.png"
        alt="userid"
        width={24}
        height={24}
        className="ml-2 opacity-80"
      />
    </div>
  </div>
  

  {/* password */}
  <div className="w-full">
    <label className="block text-white text-md font-bold mb-2">
      Password
    </label>
    <div className="flex items-center border-b-2 border-white/40 px-3 py-2 focus-within:border-[#8e4eed] transition">
      <input
        type={showPassword ? "text" : "password"}
        required
        value={loginData.password}
        onChange={(e) =>
          setLoginData({ ...loginData, password: e.target.value })
        }
        placeholder="Enter your password"
        className="flex-1 bg-black font-sans outline-none text-white placeholder-gray-400 text-base"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="ml-2 focus:outline-none"
      >
        {showPassword ? (
          <Image
            src="/assets/lock_icon.png"
            alt="show"
            width={22}
            height={22}
            className="opacity-80"
          />
        ) : (
          <Image
            src="/assets/lock_icon.png"
            alt="hide"
            width={22}
            height={22}
            className="opacity-80"
          />
        )}
      </button>
    </div>
  </div>

  {/* button */}
  <div>
    <button
      type="submit"
      disabled={isLoading}
      className="relative w-full h-[45px] rounded-full border-2 border-[#401683] font-semibold overflow-hidden z-10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="absolute -top-full left-0 w-full h-[300%] bg-gradient-to-b from-[#7127E9] via-[#6B37BF] to-[#401683] z-[-1] transition-all duration-500 hover:top-0"></span>
      {isLoading ? "Logging in..." : "Login"}
    </button>
  </div>

  {/* links */}
  <div className="text-sm flex flex-col items-center text-center space-y-2">
    <p>
      <button
        type="button"
        onClick={() => setActiveForm("forget")}
        className="text-[#AA7EF5] font-semibold hover:underline"
      >
        Forgot Password?
      </button>
    </p>
    <p className="text-white gap-2">
      Do not have an account?{" "}
      <button
        type="button"
        onClick={() => setActiveForm("register")}
        className="text-[#AA7EF5] font-semibold hover:underline"
      >
        Sign Up
      </button>
    </p>
  </div>
</form> 
</div>

{/* login + other info section */}
<div
  className={`absolute font-sans h-full hidden md:flex flex-col justify-center
  ${activeForm === "login" ? "right-0 text-right pr-10 lg:pr-[65px] pl-10 lg:pl-[150px]" : "right-0 text-right pr-10 lg:pr-[65px] pl-10 lg:pl-[150px]"}
  pb-[150px] lg:pb-[300px]
  `}
>
  <h2 className="uppercase text-3xl lg:text-[50px] leading-tight text-white font-bold flex items-center gap-2">
  {activeForm === "login" ? (
    <>
      WELCOME  Back
        
        <Image
          src="/assets/corptube_logo-bgRemoved.png"
          alt="logo"
          width={40}
          height={40}
          className="  opacity-80"
        />
    </>
  ) : (
    <>
      WELCOME <br /> 
      <span className="flex items-center gap-2">
        Back
        <br></br>
        <Image
          src="/assets/corptube_logo-bgRemoved.png"
          alt="logo"
          width={40}
          height={40}
          className=" inline-block opacity-80"
        />
      </span>
    </>
  )}
</h2>

  <p
    className={`text-base lg:text-lg max-w-[240px] mt-4 text-white
    ${activeForm === "login" ? "" : ""}`}
  >
    {activeForm === "login" ? (
      <>
        To India’s own social app <b>Corptube</b>. For India By the Indians.
      </>
    ) : (
      <>We’re delighted to have you here. If you need any assistance, feel free to reach out.</>
    )}
  </p>
</div>



{/* Register Form */}
<div
  className={`absolute font-sans top-0 left-0 w-full md:w-2/5 h-full flex flex-col justify-center px-6 md:px-12 lg:px-[60px] transition-all duration-500 ${
    activeForm !== "register" ? "hidden" : "flex"
  }`}
>
  <h2 className="text-3xl lg:text-3xl font-bold text-center text-white">
    Sign Up
  </h2>

 <form onSubmit={handleRegisterSubmit} className="mt-2 space-y-2">
  {/* Error Message */}
  {error && (
    <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-3">
      {error}
    </div>
  )}

  {/* Full Name */}
  <div className="relative">
    <label className="block text-white text-lg font-medium mb-2">
      Full Name
    </label>
    <div className="flex items-center border-b-2 border-white focus-within:border-[#8e4eed]">
      <input
        type="text"
        required
        value={registerData.fullName}
        onChange={(e) =>
          setRegisterData({ ...registerData, fullName: e.target.value })
        }
        className="flex-1 bg-transparent outline-none text-white font-medium text-lg py-2"
      />
      <Image
        src="/assets/usernam_icon.png"
        alt="fullname"
        width={24}
        height={24}
        className="ml-2 opacity-80"
      />
    </div>
  </div>

  {/* Email */}
  <div className="relative">
    <label className="block text-white text-lg font-medium mb-2">
      Email Address
    </label>
    <div className="flex items-center border-b-2 border-white focus-within:border-[#8e4eed]">
      <input
        type="email"
        required
        value={registerData.email}
        onChange={(e) =>
          setRegisterData({ ...registerData, email: e.target.value })
        }
        className="flex-1 bg-transparent outline-none text-white font-medium text-lg py-2"
      />
      <Image
        src="/assets/at-line_icon.png"
        alt="email"
        width={24}
        height={24}
        className="ml-2 opacity-80"
      />
    </div>
  </div>
 

  {/* Password */}
  <div className="relative">
    <label className="block text-white text-lg font-medium mb-2">
      Password
    </label>
    <div className="flex items-center border-b-2 border-white focus-within:border-[#8e4eed]">
      <input
        type={showPassword ? "text" : "password"}
        required
        value={registerData.password}
        onChange={(e) =>
          setRegisterData({ ...registerData, password: e.target.value })
        }
        className="flex-1 bg-transparent outline-none text-white font-medium text-lg py-2"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="ml-2 text-white hover:text-[#AA7EF5]"
      >
        {showPassword ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.708-4.362M9.88 9.88a3 3 0 104.24 4.24M6.1 6.1l11.8 11.8"
            />
          </svg>
        )}
      </button>
    </div>
  </div>

  {/* Button */}
  <div className="mt-6">
    <button
      type="submit"
      disabled={isLoading}
      className="relative w-full h-[45px] rounded-full border-2 border-[#401683] font-semibold overflow-hidden text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="absolute -top-full left-0 w-full h-[300%] bg-gradient-to-b from-[#7127E9] via-[#6B37BF] to-[#401683] z-[-1] transition-all duration-500 hover:top-0"></span>
      {isLoading ? "Creating Account..." : "Sign Up"}
    </button>
  </div>

  {/* Link */}
  <div className="text-sm text-white text-center mt-5">
    <p>
      Already have an account?{" "}
      <a
        href="#"
        onClick={() => setActiveForm("login")}
        className="text-[#AA7EF5] font-semibold hover:underline"
      >
        Sign In
      </a>
    </p>
  </div>
</form>
</div>



      {/* ---------------- Forget Section ---------------- */}
    {/* Forgot Password Section */}
<div
  className={`absolute top-0 left-0 w-full md:w-1/2 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-[40px]
  ${activeForm !== "forget" ? "hidden" : ""}`}
>
  <h2 className="text-white font-extrabold text-2xl sm:text-3xl lg:text-4xl text-center">
    Forgot Password
  </h2>
  <p className="text-gray-300 text-center mt-2 text-sm sm:text-base">
    Enter your email to receive an Link and reset your password.
  </p>

   <form onSubmit={handleForgetSubmit} className="mt-8 space-y-6">
     {/* Error Message */}
     {error && (
       <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-3">
         {error}
       </div>
     )}

     {/* email input */}
     <div className="relative w-full">
       <input
         type="email"
         required
         value={forgetData.email}
         onChange={(e) => setForgetData({...forgetData, email: e.target.value})}
         className="peer w-full px-3 pt-5 pb-2 bg-transparent border-2 border-white/40 rounded-lg text-white placeholder-transparent
                    focus:border-[#8e4eed] focus:ring-2 focus:ring-[#8e4eed]/50 outline-none transition"
         placeholder="Enter your email"
       />
       <label
         className="absolute left-3 top-2 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#AA7EF5]"
       >
         Email Address
       </label>
     </div>

     {/* button */}
     <div>
       <button
         type="submit"
         disabled={isLoading}
         className="relative w-full h-[45px] rounded-full border-2 border-[#401683] font-semibold overflow-hidden text-white disabled:opacity-50 disabled:cursor-not-allowed"
       >
         <span className="absolute -top-full left-0 w-full h-[300%] bg-gradient-to-b from-[#7127E9] via-[#6B37BF] to-[#401683]
                         z-[-1] transition-all duration-500 hover:top-0">
         </span>
         {isLoading ? 'Sending...' : 'Send  link '}
       </button>
     </div>

    {/* back to login */}
    <div className="text-sm text-center mt-5">
      <button
        type="button"
        onClick={() => setActiveForm("login")}
        className="text-[#AA7EF5] font-semibold hover:underline"
      >
        Back to Login
      </button>
    </div>
  </form>
</div>



    </div>
  );

};

export default AuthPage;

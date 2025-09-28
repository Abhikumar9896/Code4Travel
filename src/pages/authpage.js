import React, { useState } from "react";
import { 
  Plane, 
  Car, 
  Train, 
  Ship, 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  Lock,
  ArrowRight,
  MapPin
} from "lucide-react";
import { signupSchema,loginSchema,forgotPasswordSchema } from "@/lib/zodSchemas/userSchema";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthPage = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

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

  const router = useRouter();

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
          router.push('/');
          toast.success("Login successful!");
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      if (error.errors) {
        // Zod validation errors
        setError(error.errors[0].message);
      } else {
        console.error('Login error:', error);
        toast.error('Login failed. Please try again.');
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
      toast.error(result.message || 'Registration failed');
    }
  } catch (error) {
    if (error.errors) {
      // Zod validation errors
      toast.error(error.errors[0].message);
    } else {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
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
        toast.success('Password reset link sent to your email!');
        setActiveForm("login");
      } else {
        toast.error(result.message || 'Failed to send reset link');
      }
    } catch (error) {
      if (error.errors) {
        // Zod validation errors
        toast.error(error.errors[0].message);
      } else {
        console.error('Password reset error:', error);
        toast.error('Failed to send reset link. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const transportIcons = [
    { Icon: Plane, delay: "0s" },
    { Icon: Car, delay: "0.5s" },
    { Icon: Train, delay: "1s" },
    { Icon: Ship, delay: "1.5s" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Left Side - Forms */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Floating Transportation Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {transportIcons.map(({ Icon, delay }, index) => (
            <Icon
              key={index}
              className="absolute text-blue-200/10 animate-pulse"
              size={120}
              style={{
                top: `${20 + (index * 15)}%`,
                right: `${10 + (index * 20)}%`,
                animationDelay: delay,
                animationDuration: "3s"
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md relative z-10">
          

          {/* Login Form */}
          {activeForm === "login" && (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-white mb-2 font-mono">Welcome Back</h2>
      <p className="text-blue-200/70 text-sm">Continue your travel journey</p>
    </div>

    <form onSubmit={handleLoginSubmit} noValidate className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm text-center">
          {error}
        </div>
      )}

                {/* Email Field */}
                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-12 py-3 text-white placeholder-blue-200/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all font-mono"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200/60" size={18} />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2 font-mono">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-12 py-3 text-white placeholder-blue-200/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all font-mono"
                      placeholder="Enter your password"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200/60" size={18} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200/60 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-mono shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* Links */}
                <div className="text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setActiveForm("forget")}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
                  >
                    Forgot Password?
                  </button>
                  <p className="text-blue-200/70 text-sm font-mono">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveForm("register")}
                      className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </form>
            </div>
            
          )}

          {/* Register Form */}
          {activeForm === "register" && (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-white mb-2 font-mono">Join TravelHub</h2>
      <p className="text-blue-200/70 text-sm">Start your travel adventure</p>
    </div>

    <form onSubmit={handleRegisterSubmit} noValidate className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm text-center">
          {error}
        </div>
      )}

                {/* Full Name Field */}
                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2 font-mono">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-12 py-3 text-white placeholder-blue-200/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all font-mono"
                      placeholder="Enter your full name"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200/60" size={18} />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-12 py-3 text-white placeholder-blue-200/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all font-mono"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200/60" size={18} />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2 font-mono">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-12 py-3 text-white placeholder-blue-200/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all font-mono"
                      placeholder="Create a password"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200/60" size={18} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200/60 hover:text-cyan-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-mono shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* Link */}
                <div className="text-center">
                  <p className="text-blue-200/70 text-sm font-mono">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveForm("login")}
                      className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Forgot Password Form */}
          {activeForm === "forget" && (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-white mb-2 font-mono">Reset Password</h2>
      <p className="text-blue-200/70 text-sm">We'll send you a reset link</p>
    </div>

    <form onSubmit={handleForgetSubmit} noValidate className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm text-center">
          {error}
        </div>
      )}

                {/* Email Field */}
                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={forgetData.email}
                      onChange={(e) => setForgetData({ ...forgetData, email: e.target.value })}
                      className="w-full bg-white/10 border border-white/30 rounded-lg px-12 py-3 text-white placeholder-blue-200/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition-all font-mono"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200/60" size={18} />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-mono shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* Back Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setActiveForm("login")}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Info Panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-3xl"></div>
        </div>

        <div className="text-center relative z-10 max-w-lg">
          {/* Animated Transportation Icons */}
          <div className="flex justify-center items-center gap-8 mb-8">
            {[Plane, Train, Car, Ship].map((Icon, index) => (
              <div
                key={index}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300 animate-bounce"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Icon className="text-cyan-300" size={28} />
              </div>
            ))}
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 font-mono">
            Explore the World
          </h2>
          <p className="text-xl text-blue-200/80 mb-8 leading-relaxed font-light">
            Connect with fellow travelers, discover amazing destinations, and make your journey unforgettable.
          </p>

          {/* Features */}
          <div className="space-y-4 text-left">
            {[
              { icon: MapPin, text: "Discover hidden destinations" },
              { icon: Car, text: "Plan your perfect route" },
              { icon: Plane, text: "Book flights & accommodations" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm"
              >
                <feature.icon className="text-cyan-400" size={24} />
                <span className="text-white font-mono">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
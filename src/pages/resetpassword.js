import React, { useState } from "react";
import { useRouter } from "next/router";
import { resetPasswordSchema } from "../lib/zodSchemas/userSchema";
import authPage from "./authpage";
const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { token, email } = router.query; // ✅ get token & email from URL

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    // Validate
    resetPasswordSchema.parse(formData);
 console.log(formData); 
    // Build payload (important: include email & token from URL)
    const payload = {
      email,            // from router.query
      token,            // from router.query
      password: formData.newPassword
    };

    console.log("Sending reset payload:", payload);

    const response = await fetch("/api/auth/resetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Try to parse JSON; if server returns HTML we'll capture it and show it
    let result;
    try {
      result = await response.json();
    } catch (parseErr) {
      const text = await response.text();
      console.error("Non-JSON response from server:", text);
      setError("Server returned non-JSON response. Check server logs.");
      setIsLoading(false);
      return;
    }
if (response.ok) {
  setSuccess(true);
  setTimeout(() => router.push("/authpage"), 1000);
} else {
  setError(result.message || "Failed to reset password.");
}

  } catch (err) {
    if (err.errors) {
      // Zod validation error
      setError(err.errors[0].message);
    } else {
      console.error("Client error:", err);
      setError("Something went wrong. Try again.");
    }
  } finally {
    setIsLoading(false);
  }
};


  // ✅ Success screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="p-8 rounded-xl bg-black/60 border border-white/20 text-center">
          <h1 className="text-2xl font-bold text-green-400 mb-2">Password Reset Successful!</h1>
          <p className="text-gray-300 mb-4">
            Your password has been updated. Redirecting you to login...
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6 bg-black/60 border border-white/20 rounded-xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-white text-sm mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent border-2 border-white/30 rounded-lg text-white focus:border-purple-500 outline-none"
              placeholder="Enter new password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-white text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-transparent border-2 border-white/30 rounded-lg text-white focus:border-purple-500 outline-none"
              placeholder="Confirm new password"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg text-white font-semibold disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Back to login */}
          <p
            onClick={() => router.push("/authpage")}
            className="text-gray-400 text-sm mt-4 text-center cursor-pointer hover:text-white"
          >
            ← Back to Login
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

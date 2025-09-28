import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const OTPPage = () => {
  const [otp, setOtp] = useState("");
  const [pendingData, setPendingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Read pending signup data from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem("pendingSignup");
    if (!data) {
      setError("Signup data missing. Please start over.");
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      setPendingData(parsedData);
    } catch (err) {
      setError("Invalid signup data. Please start over.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pendingData) {
      setError("Signup data missing. Please start over.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = { ...pendingData, code: otp };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.removeItem("pendingSignup");
        router.push("/dashboard");
      } else {
        setError(result.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !pendingData) {
    // If no signup data, force user to go back to signup page
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push("/authpage")}
            className="bg-purple-700 px-4 py-2 rounded"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 w-full max-w-md border border-white/20">
        <h1 className="text-2xl font-bold text-white mb-4">Verify OTP</h1>
        <p className="text-gray-300 mb-4">
          OTP has been sent to <span className="font-semibold">{pendingData?.email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            required
            className="w-full p-2 rounded bg-black/30 text-white border border-white/20 text-center"
          />
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full p-2 rounded bg-purple-700 hover:bg-purple-800 text-white font-semibold disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;

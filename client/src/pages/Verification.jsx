import { useState } from "react";
import axios from "axios";
import "./verification.css";
import { useLocation, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/tostify";

const Verification = () => {
  const location = useLocation();
  const email = location?.state?.email;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      showErrorToast("Please enter the complete 6-digit code!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/auth/verifyEmail`, {
        otp: verificationCode,
        email
      });

      showSuccessToast(response.data.message || "Verification successful!");
      console.log("API Response →", response.data);
       setCode(["", "", "", "", "", ""]);
       navigate('/login')

    } catch (error) {
      console.error("Verification Error:", error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || "Verification failed!");
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP FUNCTION
  const handleResendOtp = async () => {
    if (!email) {
      showErrorToast("Email not found! Please go back and sign up again.");
      return;
    }

    setResendLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/auth/resendOtp`, {
        email
      });

      showSuccessToast(response.data.message || "OTP has been resent!");
      setCode(["", "", "", "", "", ""]);

      console.log("Resend OTP Response →", response.data);
    } catch (error) {
      console.error("Resend OTP Error:", error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || "Failed to resend OTP!");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <form className="verification-form" onSubmit={handleSubmit}>
        <h2>Enter Verification Code</h2>
        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
            />
          ))}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
        <button
          type="button"
          className="resend-btn"
          onClick={handleResendOtp}
          disabled={resendLoading}
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>
      </form>
    </div>
  );
};

export default Verification;
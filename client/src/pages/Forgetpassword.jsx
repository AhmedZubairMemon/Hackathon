import { useState } from "react";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../utils/tostify";
import "./forgetpassword.css";
import { useNavigate } from "react-router-dom";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

  const handleForget = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/auth/forgetpassword`, { email });
      showSuccessToast(response.data.message || "Reset link sent!");
      setEmail("");
      navigate("/resetpassword", { state: { email } });
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to send reset link!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-container">
      <form className="forget-form" onSubmit={handleForget}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default Forget;
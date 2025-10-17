import { useContext, useState } from "react";
import axios from "axios";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/tostify";
import {  AuthContext } from "../context/AuthContext";

const Login = () => {
  const { user, login } = useContext(AuthContext); // AuthContext
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  // Agar user already logged in, dashboard par redirect
  if (user) {
    navigate("/Homepage");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      showSuccessToast(response.data.message || "Login successful!");
      login({ email: formData.email }); // Context me user set karo
      localStorage.setItem("token", response.data.token);

      navigate("/Homepage"); // Login ke baad dashboard

    } catch (error) {
      showErrorToast(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <div className="password-field">
          <input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="button" className="toggle-btn" onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="forgot-link" onClick={() => navigate("/forgetpassword")}>Forgot Password?</p>
        <p>Don’t have an account? <Link to="/signup" className="sign">Sign up</Link></p>
      </form>
    </div>
  );
};

export default Login;
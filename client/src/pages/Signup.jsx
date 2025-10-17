import { useContext, useState } from "react";
import axios from "axios";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/tostify";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const { user, login } = useContext(AuthContext); // AuthContext se user aur login function
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    cPassword: "",
    terms: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cPasswordVisible, setCPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Agar user already logged in, redirect dashboard
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.cPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}api/auth/signup`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        cPassword: formData.cPassword
      });
      console.log(response.data);

      showSuccessToast("Signup successful!");
      login({ email: formData.email }); // Context me user set karo
      localStorage.setItem("token", response.data.token);

      navigate("/verify"); // Signup ke baad dashboard par redirect

    } catch (error) {
      showErrorToast(error.response?.data?.message || "Signup failed!");
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="form-row">
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        </div>
        <input type="text" name="userName" placeholder="Username" value={formData.userName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <div className="form-row">
          <div className="password-field">
            <input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <button type="button" className="toggle-btn" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          <div className="password-field">
            <input type={cPasswordVisible ? "text" : "password"} name="cPassword" placeholder="Confirm Password" value={formData.cPassword} onChange={handleChange} required />
            <button type="button" className="toggle-btn" onClick={() => setCPasswordVisible(!cPasswordVisible)}>
              {cPasswordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <label className="terms">
          <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} required />
          I agree to the Terms & Privacy Policy
        </label>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
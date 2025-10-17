import React from "react";
import "./Homepage.css";
import Navbar from "../components/Navbar";

const Homepage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <section className="home-section">
        <h2>Welcome to HackathonApp</h2>
        <p>Build something amazing in 12 hours! 🚀</p>
        <button>Get Started</button>
      </section>
    </div>
  );
};

export default Homepage;
import React, { useState } from "react";
import "./homepage.css";
import Navbar from "../components/Navbar.jsx";
import UploadReport from "./UploadReport.jsx";
import ViewReport from "./viewReport.jsx";

const Homepage = () => {
  const [uploadedReport, setUploadedReport] = useState(null);

  return (
    <div className="homepage">
      <Navbar />

      {/* 🏠 Hero Section */}
      <section className="home-section" id="home">
        <h2>Welcome to HealthMate</h2>
        <p>
          Your Smart Health Companion for Reports, AI Summaries, and Vitals
          Tracking 💙
        </p>
        <button>Get Started</button>
      </section>

      {/* 📤 Upload Section */}
      <section className="upload-section">
        <h3>Upload Your Medical Report</h3>
        <UploadReport onUploadSuccess={(data) => setUploadedReport(data)} />
      </section>

      {/* 👀 View Section */}
      {uploadedReport && (
        <section className="view-section">
          <h3>View Your Uploaded Report</h3>
          <ViewReport report={uploadedReport} />
        </section>
      )}
    </div>
  );
};

export default Homepage;
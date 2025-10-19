import React, { useState } from "react";
import "./viewReport.css";

const ViewReport = ({ report }) => {
  const [language, setLanguage] = useState("english");

  if (!report) return <p>No report found.</p>;

  return (
    <div className="view-report">
      <h2>🩺 View Medical Report</h2>

      <div className="report-card">
        <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
          📄 Open Uploaded Report
        </a>

        <div className="summary-box">
          <h4>
            AI Summary ({language === "english" ? "English" : "Roman Urdu"})
          </h4>
          <p>
            {language === "english"
              ? report.englishSummary
              : report.romanUrduSummary}
          </p>

          <button
            onClick={() =>
              setLanguage(language === "english" ? "roman" : "english")
            }
          >
            Switch to {language === "english" ? "Roman Urdu" : "English"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
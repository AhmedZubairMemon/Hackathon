import React, { useState } from "react";
import axios from "axios";
import "./UploadReport.css";

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false); // Upload state
  const [message, setMessage] = useState(""); // Response message

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8000/api/upload/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.url);
      setMessage("✅ Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Image to Cloudinary</h2>
      
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="response-message">{message}</p>}

      {imageUrl && (
        <div className="image-preview">
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" />
        </div>
      )}
    </div>
  );
};

export default UploadReport;
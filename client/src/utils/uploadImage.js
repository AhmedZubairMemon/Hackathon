import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("http://localhost:5000/api/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.url; // Cloudinary ka secure_url return karega
  } catch (err) {
    console.error("Image upload failed:", err);
    return null;
  }
};

export default uploadImage;
import React, { useRef, useState, useContext } from "react";
import { UserContext } from "../../components/userContext/userContext";
import axios from "axios";
import styles from "../chatGPT/search.module.css";
import customFetch from "../../api";
import bot from "../../assets/bot.svg";

const ChatComponent = () => {
  const [prompt, setPrompt] = useState(""); // Stores the user input prompt
  const [response, setResponse] = useState(""); // Stores the response from the backend
  const [status, setStatus] = useState(null); // Stores status messages
  const { name } = useContext(UserContext); // Fetches the user's name from context
  
  const [getResponse, setGetResponse] = useState({
    userName: name,
    content: "",
    infotype: "", // Main category: "healthy-tips", "recipes", "workouts"
    subCategory: "", // Subcategory based on infotype
    picture: "",
  });

  const inputFile = useRef(null);

  // Input Handlers
  const handleInputChange = (event) => setPrompt(event.target.value);
  const handleInfotypeChange = (event) => {
    const value = event.target.value;
    setGetResponse((prevState) => ({
      ...prevState,
      infotype: value, // Set infotype directly
      subCategory: "", // Reset subcategory when infotype changes
    }));
  };
  const handleSubCategoryChange = (event) => {
    const value = event.target.value;
    setGetResponse((prevState) => ({
      ...prevState,
      subCategory: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const apiResponse = await axios.post("http://localhost:3001/chatCompletion", { prompt });
      setResponse(apiResponse.data.response || "No response from server.");
      setStatus({ type: "success", message: "Prompt generated successfully!" });
    } catch (error) {
      console.error("Error:", error);
      setStatus({ type: "error", message: "Failed to fetch response from the server." });
    }
  };

  const fileUpload = async () => {
    const files = inputFile.current.files;
    if (files.length === 0) return "";

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "h9rhkl6h");

    try {
      const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/da6il8qmv/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await uploadResponse.json();
      return data.url || "";
    } catch (error) {
      console.error("Image upload failed:", error);
      setStatus({ type: "error", message: "Image upload failed. Please try again." });
      return "";
    }
  };

  const onSave = async () => {
    if (!name || !response || !getResponse.infotype || !getResponse.subCategory) {
      setStatus({ type: "error", message: "Please ensure all fields are filled." });
      return;
    }

    try {
      const picture = await fileUpload();

      const data = {
        userName: name,
        content: response, // Response from the backend
        infotype: getResponse.infotype, // Main category
        subCategory: getResponse.subCategory, // Subcategory
        picture: picture || getResponse.picture, // Uploaded picture or existing one
      };

      console.log("Data being sent:", data);

      const savedResponse = await customFetch("POST", "savePrompt", { body: data });
      setGetResponse(savedResponse);

      setStatus({ type: "success", message: "Prompt saved successfully!" });
    } catch (error) {
      console.error("Error saving prompt:", error);
      setStatus({ type: "error", message: "Failed to save the prompt. Please try again." });
    }
  };

  // Predefined Subcategories Based on Infotype
  const subCategories = {
    recipes: ["vegan", "vegetarian", "keto", "paleo", "gluten-free", "mediterranean", "low-carb"],
    workouts: ["basic", "medium", "advanced"],
    "healthy-tips": [], // No subcategories for healthy-tips
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.img}>
          <img src={bot} alt="ai-woman" />
        </div>
        <form onSubmit={handleSubmit} className={styles.prompt}>
          <textarea
            value={prompt}
            onChange={handleInputChange}
            placeholder="example: please create a paleo recipe for a 70 years old woman in menopause, please give me direct answer..."
          ></textarea>

          {/* Infotype Selection */}
          <div className={styles.check}>
            <label>
              <input
                type="radio"
                name="infotype"
                value="healthy-tips"
                onChange={handleInfotypeChange}
              />
              Healthy Tips
            </label>
            <label>
              <input
                type="radio"
                name="infotype"
                value="recipes"
                onChange={handleInfotypeChange}
              />
              Recipes
            </label>
            <label>
              <input
                type="radio"
                name="infotype"
                value="workouts"
                onChange={handleInfotypeChange}
              />
              Workouts
            </label>
          </div>

          {/* Subcategory Dropdown (conditional based on infotype) */}
          {getResponse.infotype && subCategories[getResponse.infotype].length > 0 && (
            <div className={styles.subCategorySelector}>
              <label>
                Select Subcategory:
                <select value={getResponse.subCategory} onChange={handleSubCategoryChange}>
                  <option value="">Select...</option>
                  {subCategories[getResponse.infotype].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* File Upload */}
          <div className={styles.upload}>
            <label>
              Upload Image
              <input
                type="file"
                ref={inputFile}
                className={styles.uploading}
              />
            </label>
          </div>

          {/* Submit Buttons */}
          <div className={styles.buttons}>
            <button className={styles.send} type="submit">
              Generate
            </button>
            <button
              className={styles.reset}
              type="button"
              onClick={() => setPrompt("")}
            >
              Reset
            </button>
          </div>
        </form>

        {/* Generated Response */}
        <div className={styles.chat}>
          <div>{response}</div>
        </div>

        {/* Save Button */}
        <button className={styles.save} onClick={onSave}>
          Save
        </button>

        {/* Status Message */}
        {status && (
          <div
            className={`${styles.statusMessage} ${
              status.type === "success" ? styles.success : styles.error
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;

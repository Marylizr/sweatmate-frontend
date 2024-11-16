import React, { useRef, useState, useContext, useEffect } from "react";
import { UserContext } from "../../components/userContext/userContext";
import axios from "axios";
import styles from "../chatGPT/search.module.css";
import customFetch from "../../api";
import bot from "../../assets/bot.svg";
import Modal from './Modal/Modal';


const ChatComponent = () => {
  const [prompt, setPrompt] = useState(""); // Stores the user input prompt
  const [response, setResponse] = useState(""); // Stores the response from the backend
  const [status, setStatus] = useState(null); // Stores status messages
  const { name } = useContext(UserContext); // Fetches the user's name from context
  const [showModal, setShowModal] = useState(false);
  const [getResponse, setGetResponse] = useState({
    userName: name,
    content: "",
    infotype: "", // Single string value for infotype
    picture: "",
  });

  const openModal = () => {
    setShowModal(true); // Open the modal
   
  };
  // Close the modal
  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  const inputFile = useRef(null);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleInfotypeChange = (event) => {
    const { value } = event.target;
    setGetResponse((prevState) => ({
      ...prevState,
      infotype: value, // Set infotype directly as a string
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const apiResponse = await axios.post("http://localhost:3001/chatCompletion", { prompt });
      setResponse(apiResponse.data.response || "No response from server.");
      setStatus({ type: "success", message: "Prompt sent successfully!" });
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
    if (!name || !response || !getResponse.infotype) {
      setStatus({ type: "error", message: "Please ensure all required fields are filled." });
      return;
    }

    try {
      const picture = await fileUpload();

      const data = {
        userName: name,
        content: response, // Response from the backend
        infotype: getResponse.infotype, // Selected infotype (string)
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

  useEffect(() => {
    customFetch("GET", "create").then((json) => {
      setGetResponse(json);
    });
  }, []);

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
            placeholder="Enter your prompt"
          ></textarea>

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

          <div className={styles.upload}>
            <label>
              <input
                type="file"
                ref={inputFile}
                className={styles.uploading}
              />
              Upload Image
            </label>
          </div>

          <div className={styles.buttons}>
            <button className={styles.send} type="submit">
              Send
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

        <div className={styles.chat}>
          <div>{response}</div>
        </div>

        <button className={styles.save} 
          onClick={() => 
          {
            openModal()
            onSave
          }
          }
          >Save
        </button>

        {/* Status Message */}
        {status && showModal && (
           <Modal isClose={closeModal} isOpen={showModal}>
            <div
              className={`${styles.statusMessage} ${
                status.type === "success" ? styles.success : styles.error
              }`}
            >
              {status.message}
            </div>
         </Modal>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;

import React, { useState} from "react";
import styles from "../card/card.module.css";

const Card = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Toggle state for show more/less
  

  // Toggle expanded content
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  // Split content into lines for preview and full view
  const contentLines = item.content ? item.content.split("\n") : [];
  const previewText = contentLines.slice(0, 3).join("\n"); // First 3 lines

  return (
    <div className={`${styles.container}`}>
      {/* Image */}
      <div>
        <img src={item.picture || "https://via.placeholder.com/150"} alt="training" />
      </div>

      {/* Workout Info */}
      
      <div className={styles.details}>
        <p>{item.subCategory}</p>
        <p className={styles.content}>
          {isExpanded ? item.content : previewText}
        </p>

        {/* Show the toggle button only if there is more content */}
        {contentLines.length > 3 && (
          <button onClick={handleToggle} className={styles.toggleButton}>
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;

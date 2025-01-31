import React, { useState, useEffect } from "react";
import styles from "./cookies.module.css"; // Create a CSS file for styling

const CookieConsent = () => {
  const [isOpen, setIsOpen] = useState(true); // Show modal by default
  const [showDetails, setShowDetails] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    strictlyNecessary: true,
    performance: false,
    targeting: false,
    functionality: false,
    unclassified: false,
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem("cookiePreferences");
    if (savedPreferences) {
      setCookiePreferences(JSON.parse(savedPreferences));
      setIsOpen(false);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(cookiePreferences));
    setIsOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify({ strictlyNecessary: true })
    );
    setCookiePreferences({ strictlyNecessary: true });
    setIsOpen(false);
  };

  const toggleDetails = () => setShowDetails(!showDetails);

  const handleCheckboxChange = (category) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    isOpen && (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2>SweatMate uses cookies</h2>
          <p>
            SweatMate uses cookies. By using our service, you consent to all cookies in accordance with our Cookie Policy.{" "}
            <a href="/terms">Read more</a>
          </p>
          <div className={styles.buttonGroup}>
            <button onClick={handleSave} className={styles.acceptBtn}>Save & Close</button>
            <button onClick={handleDecline} className={styles.declineBtn}>I Disagree</button>
          </div>

          <button onClick={toggleDetails} className={styles.detailsToggle}>
            {showDetails ? "Hide Details" : "Show Details"}
          </button>

          {showDetails && (
            <div className={styles.detailsSection}>
              <label>
                <input
                  type="checkbox"
                  checked={cookiePreferences.strictlyNecessary}
                  disabled
                />
                <strong>Strictly Necessary</strong>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={cookiePreferences.performance}
                  onChange={() => handleCheckboxChange("performance")}
                />
                Performance
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={cookiePreferences.targeting}
                  onChange={() => handleCheckboxChange("targeting")}
                />
                Targeting
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={cookiePreferences.functionality}
                  onChange={() => handleCheckboxChange("functionality")}
                />
                Functionality
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={cookiePreferences.unclassified}
                  onChange={() => handleCheckboxChange("unclassified")}
                />
                Unclassified
              </label>

              <div className={styles.cookieDeclaration}>
                <h3>Cookie Declaration</h3>
                <p><strong>Strictly Necessary:</strong> Essential for site functionality.</p>
                <p><strong>Performance:</strong> Helps us analyze how visitors use our site.</p>
                <p><strong>Targeting:</strong> Used for personalized advertising.</p>
                <p><strong>Functionality:</strong> Stores user preferences (e.g., language, time zone).</p>
                <p><strong>Unclassified:</strong> Currently being categorized.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default CookieConsent;

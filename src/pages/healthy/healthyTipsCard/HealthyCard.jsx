import React from 'react';
import styles from './healthyCard.module.css';



const HealthyTips = ({ item }) => {
  const formattedContent = item.content
    ? item.content
        .split('\n') // Split into paragraphs by line breaks
        .map((paragraph, index) => <p key={index}>{paragraph}</p>)
    : null;

  return (
    <div className={styles.cardWrap}>
      <div className={styles.style}>
        <h3>{item.infotype}</h3>

        <div className={styles.wrapper}>
          {/* Display image */}
          <img src={item.picture} alt="card_img" />

          {/* Render content */}
          <div className={styles.content}>
            {formattedContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthyTips;

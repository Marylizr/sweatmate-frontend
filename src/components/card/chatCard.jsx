import React from 'react';
import styles from '../card/card.module.css';



const ChatCard = ({ item }) => {

      console.log(item)
     return(
          <div className={styles.info}>
              {item}
          </div>
     )
};

export default ChatCard;
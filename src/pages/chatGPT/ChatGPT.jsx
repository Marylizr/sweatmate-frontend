import React, { useState } from 'react';
import axios from 'axios';
import styles from '../chatGPT/search.module.css';

const ChatComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };
  const onReload = () => {
    window.location.reload()
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/chat', { prompt });
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.prompt}>
        <input type="text" value={prompt} onChange={handleInputChange} placeholder="prompt"/>
        <div className={styles.buttons}>
          <button className={styles.send} type="submit">Send</button>
          <button className={styles.reset} onClick={onReload}>Reset</button>
        </div>
     
      </form>
      <div className={styles.chat}>
        <textarea>{response}</textarea>
        
      </div>
    </div>
  );
};

export default ChatComponent;

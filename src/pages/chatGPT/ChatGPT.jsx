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
    <div>
      <form onSubmit={handleSubmit} className={styles.prompt}>
        <input type="text" value={prompt} onChange={handleInputChange} />
        <button className={styles.send} type="submit">Send</button>
        <button className={styles.reset} onClick={onReload}>Reset</button>
      </form>
      <div className={styles.chat}>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default ChatComponent;

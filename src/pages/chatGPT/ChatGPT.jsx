import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../chatGPT/search.module.css';
import customFetch from '../../api';


const ChatComponent = () => {
  const [prompt, setPrompt] = useState();
  const [response, setResponse] = useState();
  const [userName, setUserName] = useState();
  const [getResponse, setGetResponse] = useState({
    userName: userName,
    content: response,
  })
  
  const getUser = () => {
    customFetch("GET", "user/me")
    .then((json) => { 
       setUserName(json.name);  
       }); }
  
    useEffect(() => {
    getUser() 
  },[]);


  const handleInputChange = (event) => {
      setPrompt(event.target.value);
    };

  const onReload = () => {
    window.location.reload()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post('http://localhost:3001/chat', { prompt });
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSave =() => {
    const data = {
      userName: userName,
      infotype: getResponse.infotype,
      content: response,
    }
    customFetch ("POST", "savePrompt", {body: data})
    .then((json) => {
      setGetResponse(json);
    })
    .catch((error) => {
      console.log(error, 'it hasn´t been possible to save the prompt');
    })
  }

    useEffect(() => {
    customFetch("GET", "savePrompt")
    .then((json) => {
    setGetResponse(json);
    })
  }, [setGetResponse]);


  console.log(getResponse, userName)
  

  return (
    <div className={styles.container}>
     <form onSubmit={handleSubmit} className={styles.prompt} id="promp_machine">
        <input type="text" value={prompt} onChange={handleInputChange} placeholder="prompt"/>
        
        <input type="hidden" value={response}
         onChange={(e) => setGetResponse({ ...getResponse, content: response })} />
        <input type="hidden" 
        onChange={(e) => setGetResponse({ ...getResponse, userName: e.target.value })} placeholder="name" />
       
        <div className={styles.check}>
          <input
            type="checkbox"
            infotype="infotype"
            value='healthy-tips'
            id="flexCheckDefault"
            onChange={(e) => setGetResponse({ ...getResponse, infotype: e.target.value })}
          />
          <label
            className=""
            htmlFor="flexCheckDefault"
          > Healthy Tips
          </label>

          <input
            type="checkbox"
            infotype="infotype"
            value="recipes"
            id="flexCheckDefault"
            onChange={(e) => setGetResponse({ ...getResponse, infotype: e.target.value })}
          />
          <label
            className="form-check-label"
            htmlFor="flexCheckDefault"
          > Recipes
          </label>

          <input
            type="checkbox"
            infotype="infotype"
            value="workouts"
            id="flexCheckDefault"
            onChange={(e) => setGetResponse({ ...getResponse, infotype: e.target.value })}
          />
          <label
            className="form-check-label"
            htmlFor="flexCheckDefault"
          > workouts
          </label>
        </div>
        
        <div className={styles.buttons}>
          <button className={styles.send} type="submit">Send</button>
          <button className={styles.reset} onClick={onReload}>Reset</button>
        </div>
     
      </form>
      <div className={styles.chat}>
       {response}
      </div>
      <button className={styles.save} onClick={() => {onSave()}}>Save</button>
    </div>
  );
};

export default ChatComponent;
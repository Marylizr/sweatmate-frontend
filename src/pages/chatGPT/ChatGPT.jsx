import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../chatGPT/search.module.css';
import customFetch from '../../api';


const ChatComponent = () => {
  const [prompt, setPrompt] = useState();
  const [response, setResponse] = useState();
  const [userName, setUserName] = useState();
  const [userinfo, setUserInfo] = useState({
    infoType: [],
    replied: [],
    });

  const [getResponse, setGetResponse] = useState({
    userName: userName,
    infoType: userinfo.infoType,
    content: response,
  })

  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => {
      setUserName(json);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setUserName]);


const handleChange = (e) => {
  // Destructuring
  const { value, checked } = e.target;
  const { infoType } = userinfo;
  
  console.log(`${value} is ${checked}`);
  
  // Case 1 : The user checks the box
  if (checked) {
    setUserInfo({
      infoType: [...infoType, value]
      .catch((error) => {
        console.log(error, `Error in setting state of infoType`);
      }),
      replied: [...infoType, value]
      .catch((error) => {
        console.log(`Error in setting state of reply`, error)})
      });
  }
  
  // Case 2  : The user unchecks the box
  else {
    setUserInfo({
      infoType: infoType.filter((e) => e !== value)
      .then((error) => {
      console.log('you have to choose a value', error)
      }),
      replied: infoType.filter((e) => e !== value),
    });
  }
};


const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const onReload = () => {
    window.location.reload()
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      userName: userName,
      infoType: userinfo.infoType,
      content: response,
    }

    customFetch("POST", "savePrompt", {body: data})
    .then((json) => {
    setGetResponse(json);
    })
    .catch((error) => {
      console.log(error);
    })

    try {
      const response = await axios.post('http://localhost:3001/chat', { prompt });
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
    useEffect(() => {
    customFetch("GET", "savePrompt")
    .then((json) => {
    setGetResponse(json);
    })
  }, [setGetResponse]);

  // const {content} = getResponse;

  console.log(getResponse)

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.prompt}>
        <input type="text" value={prompt} onChange={handleInputChange} placeholder="prompt"/>
        
        <input type="hidden" value={response}
         onChange={(e) => setGetResponse({ ...getResponse, content: e.target.value })} />
        <input type="hidden" 
        onChange={(e) => setGetResponse({ ...getResponse, userName: e.target.value })} placeholder="name" />
       
        <div className={styles.check}>
          <input
            type="checkbox"
            infoType="infoType"
            value="Healthy Tips"
            id="flexCheckDefault"
            onChange={handleChange}
          />
          <label
            className=""
            htmlFor="flexCheckDefault"
          > Healyhy Tips
          </label>

          <input
            type="checkbox"
            infoType="infoType"
            value="Recipes"
            id="flexCheckDefault"
            onChange={handleChange}
          />
          <label
            className="form-check-label"
            htmlFor="flexCheckDefault"
          > Recipes
          </label>

          <input
            type="checkbox"
            infoType="infoType"
            value="WorkOuts"
            id="flexCheckDefault"
            onChange={handleChange}
          />
          <label
            className="form-check-label"
            htmlFor="flexCheckDefault"
          > WorkOuts
          </label>
        </div>
        
        <div className={styles.buttons}>
          <button className={styles.send} type="submit">Send</button>
          <button className={styles.reset} onClick={onReload}>Reset</button>
        </div>
     
      </form>
      <div className={styles.chat}>
       {
       response
       }
      </div>
    </div>
  );
};

export default ChatComponent;

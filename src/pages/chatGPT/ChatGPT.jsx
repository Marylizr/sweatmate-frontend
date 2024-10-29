import React, {useRef,useState, useContext, useEffect } from 'react';
import { UserContext } from '../../components/userContext/userContext';
import axios from 'axios';
import styles from '../chatGPT/search.module.css';
import customFetch from '../../api';
import bot from '../../assets/bot.svg'


const ChatComponent = () => {

  const [prompt, setPrompt] = useState();
  const [response, setResponse] = useState();
  const { name  } = useContext(UserContext);
  const [getResponse, setGetResponse] = useState(
    {
    userName: name,
    content: response,
  })
  
  const handleInputChange = (event) => {
      setPrompt(event.target.value);
    };

  const onReload = () => {
    window.location.reload()
  }
  const fileUpload = async () => {
    const files = inputFile.current.files;
    const formData = new FormData();
    const url = `https://api.cloudinary.com/v1_1/da6il8qmv/image/upload`;

    let imagen;
    let file = files[0];
    formData.append("file", file);
    formData.append("upload_preset", 'h9rhkl6h');
    console.log(formData, files);
    await fetch(url, {
      method: "POST",
      header: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((photo) => {
        imagen = photo.url;

      })
      .catch((data) => {
        console.log(data);
      });

    return imagen;
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post('http://localhost:3001/chat', { prompt });
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const inputFile = useRef(null);

  const onSave = async () => {
    alert('saving')
    const imagen = fileUpload();
    let resultado;
    await imagen.then(result => { resultado = result; });

    const data = {
      userName: name,
      infotype: getResponse.infotype,
      content: response,
      picture: resultado ? resultado : getResponse.picture,
    }
    customFetch ("POST", "savePrompt", {body: data})
    .then((json) => {
      setGetResponse(json);
    })
    .then( window.location.reload())
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


  

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
      <div className={styles.img}>
          <img src={bot}
          alt='ai-woman' />
          </div>
        <form onSubmit={handleSubmit} className={styles.prompt} id="promp_machine">
            <textarea defaultValue={prompt}
            onChange={handleInputChange} placeholder="prompt">
            </textarea>
            
            <input type="hidden" value={response}
            onChange={(e) => setGetResponse({ ...getResponse, content: response })} />
            <input type="hidden" 
            onChange={(e) => setGetResponse({ ...getResponse, userName: e.target.value })} placeholder="name" />
          
            <div className={styles.check}>
              <input type="checkbox" infotype="infotype" value='healthy-tips' id="flexCheckDefault"
                onChange={(e) => setGetResponse({ ...getResponse, infotype: e.target.value })}
              />
              <label htmlFor="flexCheckDefault"> Healthy Tips </label>

              <input type="checkbox" infotype="infotype" value="recipes" id="flexCheckDefault"
                onChange={(e) => setGetResponse({ ...getResponse, infotype: e.target.value })}
              />
              <label htmlFor="flexCheckDefault"> Recipes </label>

              <input type="checkbox" infotype="infotype" value="workouts" id="flexCheckDefault"
                onChange={(e) => setGetResponse({ ...getResponse, infotype: e.target.value })}
              />
              <label htmlFor="flexCheckDefault"> workouts </label>
            </div>

            {/* upload image */}
            <div className={styles.upload}>
              <label>
                <input type='file' ref={inputFile}
                  onChange={(e) => setGetResponse({ ...getResponse, image: URL.createObjectURL(e.target.files[0]) })}
                  className={styles.uploading}></input>
              </label>
            </div>
            
            <div className={styles.buttons}>
              <button className={styles.send} type="submit">Send</button>
              <button className={styles.reset} onClick={onReload}>Reset</button>
            </div>
          </form>
    
          <div className={styles.chat}>
            <p>
              {response}
            </p>
          </div>
          <button className={styles.save} onClick={() => {onSave()}}>Save</button>
    </div> 
    {/* wrapper */}
    
    </div>
    
    
  );
};

export default ChatComponent;
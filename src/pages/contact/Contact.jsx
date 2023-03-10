import React, { useState , useEffect} from 'react';
import NavBar from '../../components/navBar/navBar';
import styles from '../contact/contact.module.css';
import customFetch from '../../api';
import CardMessages from '../../components/card/cardMessages';


const ContactForm = ({onClick}) => {

   const [info, setInfo] = useState(
      {
         name:"name",
         email:"email",
         message:"message"
      }
   )

   const [user, setUser] = useState(
      { 
         name:"name", 
         email: "email", 
      });
   

    const getUser = () => {
      customFetch("GET", "user/me")
      .then((json) => { 
         setUser({...json, password:""});  
         }); }
    
      useEffect(() => {
      getUser() 
    },[]);

   

    useEffect(() => {
      customFetch("GET", "contact")
      .then((json) => { 
         setInfo(json);  
         });
      
    }, [setInfo])
    

      const handleSubmit = async() => {
         const data = {
           name: info.name, 
           email:info.email, 
           message:info.message
         }
         customFetch("POST", "contact", {body:data})
         .then((json) => {
            setInfo(json)
          })
         .catch(err => console.log(err));  
      }    

         
      


  return (
   <div className={styles.container}>
      <NavBar />

      <h2>Hello {user.name} Do you have a request?</h2>
      <h3>Fill our contact form</h3>

       <form >
         <label htmlFor="name">Name:</label>
         <input
         id="name" type="text" placeholder='name'
         onChange={(e) => setInfo({ ...info, name: e.target.value })}
         required
         />

         <label htmlFor="email">Email:</label>
         <input id="email" type="email" placeholder='email'
         onChange={(e) => setInfo({ ...info, email: e.target.value })}
         required
         />

         <label htmlFor="message">Message:</label>
         <textarea placeholder='message' rows={3} cols={40}
                onChange={(e) => setInfo({ ...info, message: e.target.value })} />

         <button className={styles.onsubmit} 
                  onClick={(e) => { e.stopPropagation(); handleSubmit(); e.preventDefault() }}>Submit</button>
    </form>
       <CardMessages item={info} id={info._id} key={info._id} onClick={onClick}/>
   </div>
   
  );
};

export default ContactForm;

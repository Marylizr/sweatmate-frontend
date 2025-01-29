import React, { useState , useEffect} from 'react';
import styles from '../contact/contact.module.css';
import customFetch from '../../api';
import Modal from "../../components/Modal/Modal";
import { useModal } from "../../hooks/useModal";


const ContactForm = () => {

   const [info, setInfo] = useState({ name:"name", email:"email", message:"message"})
   const [user, setUser] = useState({ name:"name", email: "email"});
   const [isOpenModal, openModal, closeModal] = useModal(false);
   const [selectedItem, setSelectedItem] = useState();


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
      const handleOnClick = () => {
         window.location.reload();
      }

  return (
   <div className={styles.container}>


      <h2>Hello {user.name} Do you have a request?</h2>
      <h3>Fill our contact form</h3>
      <div className={styles.wrapper}>
         <div className={styles.image}>
            <img src='https://res.cloudinary.com/da6il8qmv/image/upload/v1695123207/trainers2_sz7j9v.png' alt=''/>
         </div>
         <form >
            <label>Name</label>
         { <input
            id="name" type="text" placeholder={user.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            required
            />}

            <label htmlFor="email">Email:</label>
            <input id="email" type="email" placeholder='email'
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
            required
            />

            <label htmlFor="message">Message:</label>
            <textarea placeholder='message' rows={3} cols={40}
                  onChange={(e) => setInfo({ ...info, message: e.target.value })} />

            <button className={styles.onsubmit} 
                     onClick={(e) => { 
                        e.stopPropagation(); 
                        handleSubmit(); 
                        e.preventDefault() 
                        setSelectedItem(info); 
                        handleOnClick()
                        openModal()  
                     }}>Submit</button>
         </form>

      </div>

       {selectedItem &&  
       <Modal isOpen={isOpenModal} closeModal={closeModal}>
            <p>{user.name}</p>
            <p>Your message was sent successfuly</p>
      </Modal>}
   </div>
   
  );
};

export default ContactForm;

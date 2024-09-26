import React, {useState, useContext } from 'react';
import { UserContext } from '../../components/userContext/userContext';
import Form from './Form';
import styles from './userProfile.module.css';
import CardMessages from '../../components/card/cardMessages';
import Modal from "./Modal/Modal";
import { useModal } from "../../hooks/useModal";

const UserProfile = () => {

  const [selectedItem, setSelectedItem] = useState()

  const [isOpenModal, openModal, closeModal] = useModal(false);
  const { users  } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <div className={styles.small_header}> 
        <h2>Users Profile</h2>
      </div>
      <div className={styles.wrap}>
      {
        users && users.length > 0 && users.map( user => 
          <CardMessages user={user} id={user._id} key={user._id}
          onClick={() => {
            setSelectedItem(user); 
            openModal(false)  
        }}/>)
           
      }
      </div>

      {selectedItem &&  
      
      <Modal isOpen={isOpenModal} closeModal={closeModal}>
            <Form selectedItem={selectedItem} />
      </Modal>}
    </div> 
  )
}

export default UserProfile;


          
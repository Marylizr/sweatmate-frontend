import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../components/userContext/userContext';
import Form from './Form';
import styles from './userProfile.module.css';
import Card from '../userProfile/Card';
import Modal from "./Modal/Modal";
import { useModal } from "../../hooks/useModal";
import customFetch from '../../api';

const UserProfile = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpenModal, openModal, closeModal] = useModal(false);
  const { users, setUsers } = useContext(UserContext);

  useEffect(() => {
    customFetch("GET", "user")
      .then((json) => setUsers(json))
      .catch((e) => console.log(e, 'cannot retrieve users'));
  }, [setUsers]);

  const handleEditUser = (user) => {
    setSelectedUser(user); // Set the selected user
    openModal();
  };

  const handleDeleteUser = (userId) => {
    customFetch("DELETE", `user/${userId}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user && user._id !== userId));
      })
      .catch(error => console.error("Error deleting user:", error));
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
    closeModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.small_header}> 
        <h2>User Profiles</h2>
      </div>
      <div className={styles.wrap}>
        {users && users.length > 0 ? (
          users.map((user) => (
            user && user._id && (
              <Card 
                key={user._id} 
                user={user} 
                onEdit={() => handleEditUser(user)} 
                onDelete={() => handleDeleteUser(user._id)} 
              />
            )
          ))
        ) : (
          <p>No users available</p>
        )}
      </div>

      {selectedUser && (
        <Modal isOpen={isOpenModal} closeModal={closeModal}>
          <Form selectedItem={selectedUser} onUpdate={handleUpdateUser} />
        </Modal>
      )}
    </div> 
  );
};

export default UserProfile;

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../components/userContext/userContext';
import Form from '../Admin-userProfile/Form';
import styles from './userProfile.module.css';
import Card from '../Admin-userProfile/Card';
import Modal from "../Admin-userProfile/Modal/Modal";
import { useModal } from "../../hooks/useModal";
import customFetch from '../../api';
import CreateUserForm from './CreateUserForm';


const AdminUserProfile = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpenModal, openModal, closeModal] = useModal(false);
  const [displayLimit, setDisplayLimit] = useState(10); // Limit to display users
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const { users, setUsers } = useContext(UserContext);
  const [trainers, setTrainers] = useState([])

  useEffect(() => {
    customFetch("GET", "user")
      .then((json) => setUsers(json))
      .catch((e) => console.log(e, 'cannot retrieve users'));
  }, [setUsers]);

  useEffect(() => {
    // Fetch the list of available personal trainers
    customFetch("GET", "user/trainers")
      .then((data) => {
        setTrainers(data);
      })
      .catch((error) => console.error("Error fetching trainers:", error));
  }, []);

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

  // Filter and paginate users
  const filteredUsers = users
    .filter((user) => user.role !== "admin" && user.name.toLowerCase().includes(searchTerm.toLowerCase())) // Exclude admin and apply search filter
    .slice(0, displayLimit); // Display limited number of users

  const handleShowMore = () => setDisplayLimit(displayLimit + 10); // Show more users

  return (
    <div className={styles.container}>
      <div className={styles.small_header}> 
        <h2>User Profiles</h2>
      </div>
      {/* create a new user*/}
      <div>
        <CreateUserForm users={users} setUsers={setUsers} trainers={trainers} />
      </div>
      
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchBox}
      />


      <div className={styles.wrap}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
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

      {/* Show More Button */}
      {displayLimit < users.filter((user) => user.role !== "admin").length && (
        <button onClick={handleShowMore} className={styles.showMoreButton}>
          Show More
        </button>
      )}

      {selectedUser && (
        <Modal isOpen={isOpenModal} closeModal={closeModal}>
          <Form selectedItem={selectedUser} onUpdate={handleUpdateUser} />
        </Modal>
      )}
    </div> 
  );
};

export default AdminUserProfile;

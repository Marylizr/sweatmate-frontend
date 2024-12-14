import React, { useState, useEffect } from 'react';
import styles from './clientlist.module.css'; // Custom CSS module
import fetchResource from '../../../api'; // Assuming fetchResource is available for API calls
import userIcon from '../../../assets/person_1.svg'; // Placeholder user image
import ChevronIcon from '../../../assets/chevron.svg'; // Chevron icon for expanding user info
import Modal from './Modal/Modal';
import ClientModal from './ClientModal';

// Client List Component
const ClientList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For modal control
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [activityHistory, setActivityHistory] = useState([]);

// Fetch user data
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const data = await fetchResource('GET', 'user'); // Fetch users
          const nonAdminAndNonTrainerUsers = data.filter(
            (user) => user.role !== "admin" && user.role !== "personal-trainer"
          ); // Exclude admin and personal-trainer users
          setUsers(nonAdminAndNonTrainerUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
    }, []);


  // Fetch user-specific events
  const fetchUserEvents = async (userId) => {
    try {
      const events = await fetchResource('GET', `events?userId=${userId}`); // Fetch events specific to this user
      setActivityHistory(events);
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  };

  // Open modal and fetch user events
  const openModal = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowModal(true); // Open the modal
    fetchUserEvents(user._id); // Fetch and display only this user's events
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedUser(null); // Clear the selected user
  };

  return (
    <div className={styles.container}>
      <h2>Client List</h2>
      <div className={styles.userList}>
        {users.map((user) => (
          <div key={user._id} className={styles.userItem}>
            <img
              src={user.image || userIcon}
              alt={`${user.name}'s profile`}
              className={styles.userImage}
            />
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userLevel}>{user.role} Level</p>
            </div>
            <img
              src={ChevronIcon}
              alt="View details"
              className={styles.chevronIcon}
              onClick={() => openModal(user)} // Open modal for this user
            />
          </div>
        ))}
      </div>

      {showModal && selectedUser && (
        <Modal isClose={closeModal} isOpen={showModal}>
          <ClientModal
            user={selectedUser}
            activityHistory={activityHistory}
            setActivityHistory={setActivityHistory}
          />
        </Modal>
      )}
    </div>
  );
};

export default ClientList;

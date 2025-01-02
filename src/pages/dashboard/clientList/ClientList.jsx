import React, { useState, useEffect } from 'react';
import styles from './clientlist.module.css';
import fetchResource from '../../../api';
import userIcon from '../../../assets/person_1.svg';
import ChevronIcon from '../../../assets/chevron.svg';
import Modal from './Modal/Modal';
import ClientModal from './ClientModal';

const ClientList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activityHistory, setActivityHistory] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchResource('GET', 'user');
        const filteredUsers = data.filter(
          (user) => user.role !== "admin" && user.role !== "personal-trainer"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const fetchUserEvents = async (userId) => {
    try {
      const events = await fetchResource('GET', `events?userId=${userId}`);
      setActivityHistory(events);
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    fetchUserEvents(user._id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
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
              onClick={() => openModal(user)}
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
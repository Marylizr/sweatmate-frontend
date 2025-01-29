import React, { useState } from 'react';
import styles from './nextEvents.module.css';
import person from '../../../assets/person_1.svg';

const CustomDropdown = ({ users, selectedUsers, setSelectedUsers }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Deselect user
        : [...prev, userId] // Select user
    );
  };

  return (
    <div className={styles.dropdown}>
      <div
        className={styles.dropdownHeader}
        onClick={toggleDropdown}
      >
        {selectedUsers.length > 0
          ? `${selectedUsers.length} user(s) selected`
          : 'Select a User '}
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {users.map((user) => (
            <div
              key={user._id}
              className={`${styles.dropdownItem} ${
                selectedUsers.includes(user._id) ? styles.selected : ''
              }`}
              onClick={() => handleUserSelect(user._id)}
            >
              <img
                src={user.image || person}
                alt={user.name}
                className={styles.userImage}
              />
              <span className={styles.userName}>{user.name}: {user.email} </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

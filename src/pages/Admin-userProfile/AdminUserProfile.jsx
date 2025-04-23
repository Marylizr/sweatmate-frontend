import React, { useState, useEffect } from 'react';
import styles from './userProfile.module.css';
import customFetch from '../../api';
import CreateUserForm from './CreateUserForm';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const AdminUserProfile = () => {
  const [users, setUsers] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await customFetch('GET', 'user');
        if (Array.isArray(response)) {
          setUsers(response);
        } else {
          console.error('Expected an array but got:', response);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const onDelete = async (userId) => {
    try {
      await customFetch('DELETE', `user/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  // Handle user editing
  const onEdit = (userId) => {
    if (!userId) {
      console.error("Invalid user ID passed to handleEditClick");
      return;
    }
    navigate(`/main/edituserprofile/${userId}`);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.role !== 'admin' &&
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show More / Show Less toggle function
  const toggleShowMore = () => {
    setDisplayLimit((prevLimit) =>
      prevLimit === 2 ? filteredUsers.length : 2
    );
  };

  return (
    <div className={styles.container}>
      <h1>Admin User Profiles</h1>

      <CreateUserForm users={users} setUsers={setUsers} />

      {/* Search Box */}
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBox}
        />
      </div>

      <div className={styles.wrap}>
        {filteredUsers.slice(0, displayLimit).length > 0 ? (
          filteredUsers.slice(0, displayLimit).map((user) =>
            user && user._id ? (
              <Card
                key={user._id}
                user={user}
                onEdit={() => onEdit(user._id)}
                onDelete={() => onDelete(user._id)}
              />
            ) : null
          )
        ) : (
          <p>No users available</p>
        )}
      </div>

      {filteredUsers.length > 2 && (
        <button onClick={toggleShowMore} className={styles.showMoreButton}>
          {displayLimit === 2 ? 'Show More' : 'Show Less'}
        </button>
      )}
    </div>
  );
};

export default AdminUserProfile;

import React, { useState, useEffect } from 'react';
import styles from '../card/card.module.css';
import customFetch from '../../api';
import { useModal } from '../../hooks/useModal';
import Modal from '../Modal/Modal';
import style from '../../pages/workoutsDash/modal.module.css';

const CardWorkout = ({ item }) => {
  const [isOpenModal, openModal, closeModal] = useModal(false);
  const [favs, setFavs] = useState(null);
  const [user, setUser] = useState(null);
  const [rounds, setRounds] = useState([
    { reps: '', weight: '', unit: 'kg' }, // Default 3 rounds
    { reps: '', weight: '', unit: 'kg' },
    { reps: '', weight: '', unit: 'kg' },
  ]);
  console.log(item)

  // Fetch the current user's information
  useEffect(() => {
    customFetch('GET', 'user/me')
      .then((json) => {
        setUser(json);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, []);

  // Handle changes to the inputs within each round
  const handleInputChange = (index, field, value) => {
    const updatedRounds = [...rounds];
    updatedRounds[index][field] = value;
    setRounds(updatedRounds);
  };

  // Add a new round
  const addRound = () => {
    setRounds([...rounds, { reps: '', weight: '', unit: 'kg' }]);
  };

  // Remove a round
  const removeRound = (index) => {
    const updatedRounds = rounds.filter((_, i) => i !== index);
    setRounds(updatedRounds);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('User information not available.');
      return;
    }

    const workoutData = {
      name: user.name,
      picture: favs.picture,
      workoutName: item.workoutName,
      rounds, // Send all rounds as an array
      date: e.target.date.value,
    };

    try {
      await customFetch('POST', 'fav', { body: workoutData });
      alert('Workout saved successfully!');
      closeModal(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <video controls src={item.video} alt="workout" />

        <div className={styles.descrip}>
          <p className={styles.bold}>Name:</p>
          <p>{item.workoutName}</p>
          <p className={styles.bold}>Description:</p>
          <p>{item.description}</p>
        </div>
      </div>

      <button
        onClick={() => {
          setFavs(item);
          openModal();
        }}
      >
        Save
      </button>

      {isOpenModal && favs && (
        <Modal isOpen={isOpenModal} closeModal={closeModal}>
          <div className={style.modal}>
            <h2>Your {favs.type} Workout</h2>
            <img src={favs.picture} alt="Workout" />

            <form onSubmit={handleFormSubmit}>
              {/* Hidden inputs */}
              <input type="hidden" name="name" value={user?.name || ''} />
              <input type="hidden" name="picture" value={favs.picture} />
              <input type="hidden" name="workoutName" value={favs.workoutName} />

              {/* Render each round dynamically */}
              {rounds.map((round, index) => (
                <div key={index} className={style.roundBlock}>
                  <h3>Round #{index + 1}</h3>

                  <div className={style.inputGroup}>
                    <input
                      type="number"
                      placeholder="Number of reps"
                      value={round.reps}
                      onChange={(e) =>
                        handleInputChange(index, 'reps', e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="Weight Lifted"
                      value={round.weight}
                      onChange={(e) =>
                        handleInputChange(index, 'weight', e.target.value)
                      }
                    />
                    <select
                      value={round.unit}
                      onChange={(e) =>
                        handleInputChange(index, 'unit', e.target.value)
                      }
                    >
                      <option value="kg">Kg</option>
                      <option value="lb">Pounds</option>
                    </select>
                  </div>

                  {/* Remove round button */}
                  {rounds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRound(index)}
                    >
                      Remove Round
                    </button>
                  )}
                </div>
              ))}

              {/* Add round button */}
              <button
                type="button"
                className={style.addButton}
                onClick={addRound}
              >
                + Add Round
              </button>


              {/* Submit button */}
              <div className={style.buttons}>
              {/* Workout date */}
               <input
                    type="date"
                    name="date"
                    placeholder="Workout date"
                    required
               />
                <button type="submit">
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CardWorkout;

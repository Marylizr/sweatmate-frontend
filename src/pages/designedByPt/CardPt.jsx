import styles from '../../components/card/card.module.css';
import customFetch from '../../api';
import { useModal } from "../../hooks/useModal";
import { useState, useEffect } from 'react';
import Modal from "../../components/Modal/Modal";
import { useForm } from 'react-hook-form';

const CardPt = ({ item }) => {
    const [isOpenModal, openModal, closeModal] = useModal(false);
    const { register, handleSubmit, reset } = useForm();
    const [favs, setFavs] = useState(null);
    const [user, setUser] = useState(null);

    // Fetch logged-in user's info (e.g., personal trainer)
    useEffect(() => {
        customFetch("GET", "user/me")
            .then((json) => setUser(json))
            .catch((error) => console.log(error));
    }, []);

    // Function to handle form submission and save the workout
    const onSubmit = (data) => {
        // Validate if all required data is present before proceeding
        if (!data.name || !data.reps || !data.series || !data.lifted || !data.date) {
            alert("Please complete all fields before saving the workout.");
            return;
        }

        const workoutData = {
            ...data,
            userName: user?.email || "",  // Attach user's email if available
            picture: favs?.picture || item.picture,  // Attach selected workout picture
        };

        // POST request to save the workout
        customFetch("POST", "personaltrainer", { body: workoutData })
            .then(() => {
                alert("Workout saved successfully!");
                closeModal();
                setFavs(null);  // Clear selected workout
                reset();  // Reset form values after submission
            })
            .catch((error) => console.error("Error saving workout:", error));
    };

    // Open modal and set selected workout
    const handleSaveWorkout = () => {
        setFavs(item);  // Set the selected workout
        reset({
            name: item.name,
            reps: item.reps,
            series: item.series,
            lifted: item.lifted,
            date: new Date().toISOString().split('T')[0],  // Set default date to today
        });
        openModal();
    };

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <video controls src={item.video} alt="workout" />
                <div className={styles.descrip}>
                    <p className={styles.bold}>Name:</p><p>{item.name}</p>
                    <p className={styles.bold}>Description:</p><p>{item.description}</p>
                </div>
            </div>
            <button onClick={handleSaveWorkout}>Save</button>

            {favs && (
                <Modal isOpen={isOpenModal} closeModal={closeModal}>
                    <h2>Your {favs.type} workout</h2>
                    <img src={favs.picture} alt="Workout" />
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        <input type="hidden" value={user?.email || ''} {...register("userName")} />
                        <input type="hidden" value={favs.picture} {...register("picture")} />

                        <input type="text" {...register("name")} placeholder="Workout Name" />
                        <input type="number" {...register("reps")} placeholder="Number of Reps" />
                        <input type="number" {...register("series")} placeholder="Number of Series" />
                        <input type="number" {...register("lifted")} placeholder="Weight Lifted" />
                        <input type="date" {...register("date")} placeholder="Workout Date" />

                        <div className={styles.buttons}>
                            <input className={styles.send} type="submit" value="Save" />
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CardPt;

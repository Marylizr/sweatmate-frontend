import React, { useState } from "react";
import styles from './goals.module.css';

const MilestoneNotifications = ({ goals, onUpdateMilestone }) => {
  const [editMilestone, setEditMilestone] = useState(null); // Track the milestone being edited
  const [achievedDate, setAchievedDate] = useState(""); // Track the achieved date input
  const [milestoneNote, setMilestoneNote] = useState(""); // Track the note input

  const handleSaveMilestone = (goalId, milestoneValue) => {
    if (!achievedDate || !milestoneNote) {
      alert("Please enter both a date and a note for the milestone.");
      return;
    }

    onUpdateMilestone(goalId, milestoneValue, {
      achievedAt: new Date(achievedDate).toISOString(),
      note: milestoneNote,
    });

    // Reset editing states
    setEditMilestone(null);
    setAchievedDate("");
    setMilestoneNote("");
  };

  return (
    <div className={styles.notificationsContainer}>
      {goals.map((goal) => (
        <div key={goal._id} className={styles.notification}>
          <h4 className={styles.goalTitle}>
            {goal.goalType} Goal: {goal.targetValue} {goal.measure}
          </h4>
          <ul className={styles.milestonesList}>
            {goal.milestones
              .sort((a, b) => new Date(a.achievedAt || 0) - new Date(b.achievedAt || 0))
              .map((milestone, index) => (
                <li
                  key={`${milestone.milestoneValue}-${index}`}
                  className={milestone.achievedAt ? styles.achieved : styles.pending}
                >
                  <div className={styles.milestoneInfo}>
                    <span>
                      {milestone.milestoneValue} {goal.measure}
                    </span>
                    <span>
                      {milestone.achievedAt
                        ? `Achieved on ${new Date(milestone.achievedAt).toLocaleDateString()}`
                        : "Not achieved yet"}
                    </span>
                    {milestone.note && (
                      <p className={styles.milestoneNote}>Note: {milestone.note}</p>
                    )}
                  </div>

                  {/* Edit Form for Logging Achievement */}
                  {!milestone.achievedAt &&
                    editMilestone === milestone.milestoneValue && (
                      <div className={styles.editMilestone}>
                        <label>
                          Achieved Date:
                          <input
                            type="date"
                            value={achievedDate}
                            onChange={(e) => setAchievedDate(e.target.value)}
                          />
                        </label>

                          <textarea
                            type="text"
                            value={milestoneNote}
                            onChange={(e) => setMilestoneNote(e.target.value)}
                            placeholder="Add a note about this milestone"
                          />
                       
                        <div className={styles.buttonStyles}> 
                          <button
                            onClick={() =>
                              handleSaveMilestone(goal._id, milestone.milestoneValue)
                            }
                            className={styles.saveButton}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditMilestone(null)}
                            className={styles.cancelButton}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                  {/* Log Achievement Button */}
                  {!milestone.achievedAt && editMilestone !== milestone.milestoneValue && (
                    <button
                      onClick={() => setEditMilestone(milestone.milestoneValue)}
                      className={styles.logButton}
                    >
                      Log Achievement
                    </button>
                  )}
                </li>
              ))}
          </ul>

          {/* Display the notes added during goal creation */}
          {goal.personalNotes && goal.personalNotes.length > 0 && (
            <div className={styles.notesContainer}>
              <h5>Goal Notes:</h5>
              <ul>
                {goal.personalNotes.map((note, index) => (
                  <li key={index} className={styles.note}>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MilestoneNotifications;

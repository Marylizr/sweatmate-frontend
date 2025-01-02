import React from "react";

const MilestoneNotifications = ({ goals }) => {
   const milestones = goals.flatMap((goal) =>
     goal.milestones.map((milestone) => ({
       goalType: goal.goalType,
       value: milestone.milestoneValue,
       measure:goal.measure,
       achievedAt: milestone.achievedAt,
     }))
   );
 
   return (
     <div>
       <h3>Milestone Achievements</h3>
       <ul>
         {milestones.map((milestone, index) => (
           <li key={index}>
             <b>{milestone.goalType}:</b> Achieved {milestone.value} on{' '}
             {new Date(milestone.achievedAt).toLocaleDateString()}
           </li>
         ))}
       </ul>
     </div>
   );
 };
 
 export default MilestoneNotifications;
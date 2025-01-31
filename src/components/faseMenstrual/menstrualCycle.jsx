import React from 'react';
import styles from './fase.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import ReactMarkdown from 'react-markdown'; // ✅ Import Markdown Renderer
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import NavBar from '../navBar/navBar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MenstrualCycle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cycleData = location.state?.cycleData;

  if (!cycleData) {
    return (
      <div className={styles.container}>
        <h2>No cycle data found</h2>
        <button onClick={() => navigate('/faseMenstrual')}>Log your menstrual cycle</button>
      </div>
    );
  }

  // ✅ Ensure recommendations exist
  const recommendations = cycleData.recommendations || "No recommendations available at the moment.";

  // ✅ Separate Training & Nutrition Recommendations
  const trainingSection = recommendations.split("### Training:")[1]?.split("### Nutrition:")[0]?.trim() || "No training advice available.";
  const nutritionSection = recommendations.split("### Nutrition:")[1]?.trim() || "No nutrition advice available.";

  // ✅ Ensure cycle history data is structured correctly
  const chartData = {
    labels: cycleData.history?.map(entry => entry.date) || ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Cycle Length (Days)',
        data: cycleData.history?.map(entry => entry.length) || [28, 30, 27, 29, 31],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <div className={styles.wrapContainer}>
      <NavBar />
      
         <div className={styles.wrap}>
            <h2>Menstrual Cycle Overview</h2>
            <p><strong>Current Phase:</strong> {cycleData.currentPhase}</p>
         
            <div className={styles.wrapper}>
               <img src='https://res.cloudinary.com/da6il8qmv/image/upload/v1738175005/woman_gym_qflnh9.png' alt='woman-training'/>

               {/* Training Section */}
               <div className={styles.trainingSection}>
                  <h3>Training Recommendations</h3>
                  <div className={styles.markdownContainer}>
                     <ReactMarkdown>{trainingSection}</ReactMarkdown>
                  </div>
               </div>

               {/* Nutrition Section */}
               <div className={styles.nutritionSection}>
                  <h3>Nutrition Recommendations</h3>
                  <div className={styles.markdownContainer}>
                     <ReactMarkdown>{nutritionSection}</ReactMarkdown>
                  </div>
            </div>

            <div className={styles.chart}>
               <h3>Cycle History</h3>
               <Line data={chartData} />
            </div>
      </div>
   </div>

     
    </div>
  );
};

export default MenstrualCycle;

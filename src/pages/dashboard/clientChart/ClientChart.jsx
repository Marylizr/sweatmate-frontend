import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import customFetch from '../../../api';
import styles from './clientchart.module.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import chart from '../../../assets/chart.svg';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ClientBarChartWithHistoricalToggle = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [userCounts, setUserCounts] = useState({});
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Fetch user data on component mount
    const fetchData = async () => {
      try {
        const users = await customFetch("GET", "user");
        const processedData = processUserData(users);
        setUserCounts(processedData);
        setAvailableYears(Object.keys(processedData).map(year => parseInt(year)).sort((a, b) => b - a));
        updateChartData(currentYear, processedData);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchData();
  }, [currentYear]);

  // Function to process user data for the chart
  const processUserData = (users) => {
    const userCountsByYear = {};

    users.forEach((user) => {
      const date = new Date(user.createdAt);
      if (!isNaN(date)) {
        const year = date.getFullYear();
        const monthYear = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}`; // Format as "YYYY-MM"

        if (!userCountsByYear[year]) {
          userCountsByYear[year] = {};
        }
        userCountsByYear[year][monthYear] = (userCountsByYear[year][monthYear] || 0) + 1;
      }
    });

    return userCountsByYear;
  };

  // Function to update the chart data based on the selected year
  const updateChartData = (year, processedData) => {
    const dataForYear = processedData[year];
    if (!dataForYear) return;

    const sortedKeys = Object.keys(dataForYear).sort();
    const lastThreeMonthsKeys = sortedKeys.slice(-3); // Get the last 3 months
    const labels = lastThreeMonthsKeys;
    const data = lastThreeMonthsKeys.map((key) => dataForYear[key]);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: `New Users Per Month (${year})`,
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    });
  };

  // Toggle the display of historical data for the current year
  const toggleHistoricalData = () => {
    setShowHistoricalData(!showHistoricalData);
    updateChartData(currentYear, userCounts);
  };

  return (
    <div className={styles.container}>
      <img src={chart} alt='chart-icon' />
      <h2 className={styles.title}>Monthly User Growth</h2>
      <Bar data={chartData} className={styles.chart} />

      <div className={styles.buttonsContainer}>
        {availableYears.map((year) => (
          year !== currentYear && (
            <button
              key={year}
              className={styles.yearButton}
              onClick={() => updateChartData(year, userCounts)}
            >
              {year}
            </button>
          )
        ))}
        <button
          className={styles.yearButton}
          onClick={toggleHistoricalData}
        >
          {showHistoricalData ? `Hide ${currentYear} Data` : `Show ${currentYear} Data`}
        </button>
      </div>
    </div>
  );
};

export default ClientBarChartWithHistoricalToggle;

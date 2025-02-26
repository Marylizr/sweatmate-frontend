import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import styles from './training.module.css';
import customFetch from '../../api';
import fitness from '../../assets/fitness.svg';

const WeekStorical = () => {
  const [user, setUser] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState([]);
  const [comparison, setComparison] = useState({ diff: 0, percentage: 0 });
  const [totals, setTotals] = useState({ totalWorkouts: 0, currentWeek: 0, gymsVisited: 0, countriesVisited: 0 });

  useEffect(() => {
    customFetch("GET", "user/me").then((json) => setUser(json || null)).catch(() => setUser(null));
    customFetch("GET", "fav").then((json) => setHistorial(Array.isArray(json) ? json : [])).catch(() => setHistorial([]));
  }, []);

  const processWorkouts = useCallback(() => {
    if (!historial.length || !user) return;
    
    const weeks = Array(6).fill(0);
    const now = new Date();
    const currentYear = now.getFullYear();
    const weekNumbers = historial.reduce((acc, workout) => {
      const date = new Date(workout.date);
      const weekNum = Math.floor((date - new Date(currentYear, 0, 1)) / (7 * 24 * 60 * 60 * 1000));
      if (weekNum >= 0 && weekNum < 6) acc[weekNum]++;
      return acc;
    }, weeks);
    
    setWorkoutsPerWeek(weekNumbers.map((count, i) => ({ week: `w. ${i + 1}`, workouts: count })));
    
    const lastWeek = weekNumbers[4];
    const thisWeek = weekNumbers[5];
    const totalWorkouts = historial.length;
    const lastMonthWorkouts = weekNumbers.slice(0, 4).reduce((a, b) => a + b, 0);
    const percentage = lastMonthWorkouts ? Math.round((thisWeek / lastMonthWorkouts) * 100) : 0;
    setComparison({ diff: thisWeek - lastWeek, percentage });
    setTotals({ totalWorkouts, currentWeek: thisWeek, gymsVisited: 16, countriesVisited: 1 });
  }, [historial, user]);

  useEffect(() => {
    processWorkouts();
  }, [processWorkouts]);

  return (
    <div className={styles.container}>
      <h2>Visits/week</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={workoutsPerWeek}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="workouts" fill="#bbb" />
        </BarChart>
      </ResponsiveContainer>

      <div className={styles.statsGrid}>
        <div className={styles.statBlock}>
          <p className={styles.statValue}>{comparison.diff}</p>
          <p>Workouts Compared to last week</p>
        </div>
        <div className={styles.statBlock}>
          <ResponsiveContainer width={100} height={100}>
            <RadialBarChart innerRadius="80%" outerRadius="100%" data={[{ value: comparison.percentage, fill: "#ff9900" }]}>
              <RadialBar minAngle={15} background dataKey="value" />
            </RadialBarChart>
          </ResponsiveContainer>
          <p>{comparison.percentage}% Compared to last month</p>
        </div>
      </div>

      <h3>Your Training History</h3>
      <div className={styles.historyGrid}>
        <div className={styles.historyBlock}>
          <p className={styles.statValue}>{totals.totalWorkouts}</p>
          <p>Workouts Total</p>
        </div>
        <div className={styles.historyBlock}>
          <p className={styles.statValue}>{totals.currentWeek}</p>
          <p>Workouts This week</p>
        </div>
        <div className={styles.historyBlock}>
          <p className={styles.statValue}>{totals.gymsVisited}</p>
          <p>Gyms visited</p>
        </div>
        <div className={styles.historyBlock}>
          <p className={styles.statValue}>{totals.countriesVisited}</p>
          <p>Countries visited</p>
        </div>
      </div>
    </div>
  );
};

export default WeekStorical;

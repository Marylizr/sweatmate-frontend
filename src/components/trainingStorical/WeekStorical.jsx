import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import styles from './training.module.css';
import customFetch from '../../api';

const WeekStorical = () => {
  const [user, setUser] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState([]);
  const [comparison, setComparison] = useState({ diff: 0, percentage: 0 });
  const [totals, setTotals] = useState({ totalWorkouts: 0, currentWeek: 0, gymsVisited: 0, countriesVisited: 0 });

  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => setUser(json || null))
      .catch(() => setUser(null));

    customFetch("GET", "fav")
      .then((json) => setHistorial(Array.isArray(json) ? json : []))
      .catch(() => setHistorial([]));
  }, []);

  // Function to get ISO Week Number
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const processWorkouts = useCallback(() => {
    if (!historial.length || !user) return;

    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const weeks = Array(6).fill(0);

    historial.forEach((workout) => {
      const workoutWeek = getWeekNumber(workout.date);
      if (workoutWeek <= currentWeek && workoutWeek > currentWeek - 6) {
        weeks[5 - (currentWeek - workoutWeek)]++;
      }
    });

    setWorkoutsPerWeek(
      weeks.map((count, i) => ({
        week: `w. ${currentWeek - 5 + i}`,
        workouts: count
      }))
    );

    const lastWeek = weeks[4];
    const thisWeek = weeks[5];
    const lastMonthWorkouts = weeks.slice(0, 4).reduce((a, b) => a + b, 0);
    const percentage = lastMonthWorkouts ? Math.round((thisWeek / lastMonthWorkouts) * 100) : 0;

    setComparison({ diff: thisWeek - lastWeek, percentage });
    setTotals({
      totalWorkouts: historial.length,
      currentWeek: thisWeek,
      gymsVisited: 16,
      countriesVisited: 1
    });
  }, [historial, user]);

  useEffect(() => {
    processWorkouts();
  }, [processWorkouts]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Visits/week</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={workoutsPerWeek}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="workouts" fill="#ADB9C7" barSize={30} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className={styles.statsGrid}>
        <div className={styles.statBlock}>
          <p className={styles.statValue}>{comparison.diff}</p>
          <p>Workouts Compared to last week</p>
        </div>
        <div className={styles.statBlock}>
          <ResponsiveContainer width={100} height={100}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: comparison.percentage, fill: "#ff9900" }]}>
              <RadialBar minAngle={15} background dataKey="value" />
            </RadialBarChart>
          </ResponsiveContainer>
          <p>{comparison.percentage}% Compared to last month</p>
        </div>
      </div>

      <h3 className={styles.subtitle}>Your Training History</h3>
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

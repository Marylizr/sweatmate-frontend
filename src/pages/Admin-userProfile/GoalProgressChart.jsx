import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const GoalProgressChart = ({ goals }) => {
  return (
    <div>
      {goals.map((goal) => (
        <div key={goal._id}>
          <h3>{goal.goalType} Goal: {goal.targetValue}</h3>
          <LineChart width={500} height={300} data={goal.progressHistory}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
      ))}
    </div>
  );
};

export default GoalProgressChart;
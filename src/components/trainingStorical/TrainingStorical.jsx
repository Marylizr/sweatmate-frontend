import React, { useState, useEffect } from 'react';

const TrainingStorical = ({ item, days }) => {
  const [displayedDay, setDisplayedDay] = useState(null);

  useEffect(() => {
    const fecha = new Date(item.date);
    const dayName = fecha.toLocaleString('en-US', { weekday: 'long' });

    if (displayedDay !== dayName) {
      setDisplayedDay(dayName);
    }
  }, [item, displayedDay]);

  console.log(days)

  return (
    <div>
      {displayedDay && `I trained on ${displayedDay}`}
    </div>
  );
}

export default TrainingStorical;

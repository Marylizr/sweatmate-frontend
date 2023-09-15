import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarioCitas() {
  const [date, setDate] = useState(new Date());
  const [citasProgramadas, setCitasProgramadas] = useState([]);

  // Función para manejar la selección de fecha
  const handleDateChange = newDate => {
    setDate(newDate);
  };

  // Función para hacer una reserva
  const hacerReserva = () => {
    setCitasProgramadas([...citasProgramadas, date]);
  };

  return (
    <div>
      <h1>Calendario de Citas</h1>
      <div>
        <Calendar
          onChange={handleDateChange}
          value={date}
        />
      </div>
      <button onClick={hacerReserva}>Hacer Reserva</button>

      <h2>Citas Programadas:</h2>
      <ul>
        {citasProgramadas.map((cita, index) => (
          <li key={index}>{cita.toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default CalendarioCitas;

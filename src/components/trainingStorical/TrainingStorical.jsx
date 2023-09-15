import React, { useState } from 'react';

const RegistroEntrenamientos = () => {
   
  const [historial, setHistorial] = useState([
    { dia: 'Lunes', porcentaje: 1 },
    { dia: 'Martes', porcentaje: 1 },
    { dia: 'Miércoles', porcentaje: 2 },
    { dia: 'Jueves', porcentaje: 0 },
    { dia: 'Viernes', porcentaje: 0 },
    { dia: 'Sábado', porcentaje: 0 },
    { dia: 'Domingo', porcentaje: 0 },
  ]);

  const handleRegistro = (dia, porcentaje) => {
    // Actualiza el historial con el nuevo porcentaje de entrenamiento
    const nuevoHistorial = historial.map(item =>
      item.dia === dia ? { ...item, porcentaje } : item
    );
    setHistorial(nuevoHistorial);
  };

  return (
    <div>
      <h1>Registro de Entrenamientos Diarios</h1>
      <div>
        {historial.map(item => (
          <div key={item.dia}>
            <p>{item.dia}</p>
            <input
              type="number"
              value={item.porcentaje}
              onChange={(e) => handleRegistro(item.dia, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistroEntrenamientos;

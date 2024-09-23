import React, { useState } from 'react';
import styles from '../faseMenstrual/fase.module.css';
import Modal from "../Modal/Modal";
import { useModal } from "../../hooks/useModal";
import cicle from '../../assets/cicle.svg';

const FaseMenstrual = () => {
  const [ultimoDiaMenstruacion, setUltimoDiaMenstruacion] = useState('');
  const [cicloMensual, setCicloMensual] = useState('');
  const [fase, setFase] = useState('');
  const [isOpenModal, openModal, closeModal] = useModal(false);
  const [info, setInfo] = useState(null);

  const calcularFases = () => {
    const fechaUltimoDia = new Date(ultimoDiaMenstruacion);
    const hoy = new Date();
    const diferenciaDias = (hoy - fechaUltimoDia) / parseInt(1000 * 60 * 60 * 24);
    const ciclo = Math.floor(diferenciaDias >= 21 ? 21 : diferenciaDias);

    setCicloMensual(ciclo);

    if (ciclo >= 1 && ciclo <= 7) {
      setFase('Menstruacion');
    } else if (ciclo >= 8 && ciclo <= 14) {
      setFase('Follicular');
    } else {
      setFase('Luteal');
    }
  };


  const getInfo = async (fase) => {

    let phaseInfo;

    if (fase === 'Menstruacion') {
      phaseInfo = {
        title: 'Weeks 1-2 (Menstrual Phase - Days 1-5)',
        nutrition: [
          'Focus on iron-rich foods to replenish iron lost during menstruation (spinach, lean meats, lentils, fortified cereals).',
          'Include complex carbohydrates (whole grains, fruits, vegetables) for sustained energy levels.',
          'Adequate hydration with water, herbal teas, and electrolyte-rich beverages.'
        ],
        training: [
          'Light to moderate-intensity exercises like yoga, stretching, and walking to help alleviate cramps and improve mood.'
        ]
      };
    }

    if (fase === 'Follicular') {
      phaseInfo = {
        title: 'Weeks 2-3 (Follicular Phase - Days 6-14)',
        nutrition: [
          'Emphasize lean proteins (chicken, fish, tofu) for muscle repair and growth.',
          'Include a variety of colorful fruits and vegetables for antioxidants and vitamins.',
          'Healthy fats (avocado, nuts, olive oil) to support hormonal balance.'
        ],
        training: [
          'Incorporate a mix of cardio and strength training exercises for overall fitness. Examples: jogging, cycling, bodyweight exercises, light weight lifting.'
        ]
      };
    }

    if (fase === 'Luteal') {
      phaseInfo = {
        title: 'Week 4 (Ovulatory Phase - Days 15-21)',
        nutrition: [
          'Focus on foods rich in calcium (dairy, leafy greens) to support bone health.',
          'Include omega-3 fatty acids (fatty fish, flaxseeds) for hormonal regulation.',
          'Fiber-rich foods (legumes, whole grains) to maintain digestive health.'
        ],
        training: [
          'Focus on lower impact exercises like Pilates, swimming, or gentle yoga to accommodate potential discomfort during this phase.'
        ]
      };
    }

    setInfo(phaseInfo);
  };

  
  console.log(` printing fase ${fase}`)
  console.log(`printing info ${info}`)

  return (
    <div className={styles.container}>
      <img src={cicle} alt='icon'/>
      <h3>Menstrual Cycle</h3>
      <form className={styles.inputFase}>
        <label>Last day of menstruation:</label>
        <input 
          type="date"
          value={ultimoDiaMenstruacion}
          onChange={(e) => setUltimoDiaMenstruacion(e.target.value)}
        />
        <button onClick={(e) => {
          calcularFases(); 
          openModal(false);
          e.preventDefault(); 
          e.stopPropagation();   
          getInfo(fase); // Pass 'fase' as argument to getInfo
        }}> Save
        </button>
      </form>

      { 
        cicloMensual && 
          <Modal isOpen={isOpenModal} closeModal={closeModal}>
            <div>
              <h3>Menstrual Cycle: {cicloMensual} days</h3>
              <p>Current Phase: {fase}</p>
              <p>
                As you are at the {fase} phase, would you like me
                to recommend you a workout?
              </p>
              <div className={styles.faseButtons}>
                <button onClick={() => 
                  {
                    getInfo(fase)
                  }} className={styles.yes}>Yes, let's go!</button>
                <button className={styles.no} onClick={closeModal}>Not today... </button>
              </div>
            </div>
            { info && (
              <div>
                <h2>{info.title}</h2>
                <h3>Nutritional Plan:</h3>
                <ul>
                  {info.nutrition.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <h3>Training Session:</h3>
                <ul>
                  {info.training.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </Modal>
      }
    </div>
  );
};

export default FaseMenstrual;

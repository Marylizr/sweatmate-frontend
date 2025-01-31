import React, { useState, useEffect } from 'react';
import styles from '../faseMenstrual/fase.module.css';
import cicle from '../../assets/cicle.svg';
import customFetch from '../../api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FaseMenstrual = () => {
  const [ultimoDiaMenstruacion, setUltimoDiaMenstruacion] = useState('');
  const [fase, setFase] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ Fix: Use state properly
  const navigate = useNavigate();
  
  const REACT_API_KEY = process.env.REACT_APP_CHAT_API_KEY;

  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => setUser(json))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const calcularFases = () => {
    const fechaUltimoDia = new Date(ultimoDiaMenstruacion);
    const hoy = new Date();
    const diferenciaDias = Math.floor((hoy - fechaUltimoDia) / (1000 * 60 * 60 * 24));
    let phase = diferenciaDias <= 7 ? 'Menstrual' : diferenciaDias <= 14 ? 'Follicular' : 'Luteal';
    setFase(phase);
  };

  const getInfoFromAI = async (phase) => {
    setIsLoading(true); // ✅ Fix: Set loading state
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an expert personal trainer and nutritionist." },
            { role: "user", content: `I am currently in my ${phase} phase of the menstrual cycle. Provide training and nutrition recommendations in this format:\n\n### Training:\n- [list training activities]\n\n### Nutrition:\n- [list nutrition tips]` },
          ],
        },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${REACT_API_KEY}` } }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching AI-generated info:", error);
      return null;
    } finally {
      setIsLoading(false); // ✅ Fix: Remove loading state
    }
  };

  const saveCycleData = async () => {
    if (!user || !user._id) return alert("User information is missing!");

    const trainingNutritionInfo = await getInfoFromAI(fase);

    const data = {
      userId: user._id,
      lastMenstruationDate: ultimoDiaMenstruacion,
      currentPhase: fase,
      recommendations: trainingNutritionInfo,
      date: new Date().toISOString(),
    };

    try {
      await customFetch("POST", "menstrualCycle", { body: data });
      alert("Cycle data saved successfully!");

      navigate("/menstrualCycle", { state: { cycleData: data } });

    } catch (error) {
      console.error("Error saving cycle data:", error);
    }
  };

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
        <button 
          onClick={(e) => {
            e.preventDefault();
            calcularFases();
            saveCycleData();
          }}
          disabled={isLoading} // ✅ Fix: Disable button while loading
        >
          {isLoading ? "Saving..." : "Save"} 
        </button>
      </form>
    </div>
  );
};

export default FaseMenstrual;

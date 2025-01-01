"use client"
import React, { useState, useRef } from 'react';
import CameraFeed from './components/CameraFeed';
import { detectPixelMovement } from './utils/detectPixelMovement2';
import styles from "./styles/Home.module.css";

const App = () => {
  const [status, setStatus] = useState('Quiet');
  const [threshold, setThreshold] = useState(0.02); // Sensibilidad normalizada
  const [absoluteThreshold, setAbsoluteThreshold] = useState(100000); // Umbral absoluto
  const lastMovementTimeRef = useRef(Date.now());
  const [umbral, setUmbral] = useState(8050000)//2575000

  const handleFrame = (video : any) => {
    detectPixelMovement(video, umbral, () => {
      console.log('Movement detected!');
      setStatus('MOVEMENT DETECTED!');
      lastMovementTimeRef.current = Date.now(); // Actualiza el tiempo de detección
    });
  };
  
    // Verifica periódicamente si debe volver a "Quiet"
    React.useEffect(() => {
    const interval = setInterval(() => {
        if (Date.now() - lastMovementTimeRef.current > 1000) {
        setStatus('Quiet');
        // consecutiveMovements.current = 0; // Reinicia el contador de movimiento
        }
    }, 1000);

    return () => clearInterval(interval);
    }, []);

    const containerClass =
    status === 'MOVEMENT DETECTED!' ? styles.movementDetected : styles.quiet;

  return (
    <div className={`${styles.main} ${containerClass}`}>
      <h1>LUZ VERDE, LUZ ROJA</h1>
      <h2>Status: {status}</h2>
        <label>
          Sensitivity (Normalized Threshold):
          <input
            type="range"
            min="1000000"
            max="10000000"
            step="500000"
            value={umbral}
            onChange={(e) => setUmbral(parseFloat(e.target.value))}
          />
        </label>
        <p>Umbral {umbral}</p>
      {/* <div>
        <label>
          Absolute Threshold:
          <input
            type="range"
            min="10000"
            max="100000"
            step="1000"
            value={absoluteThreshold}
            onChange={(e) => setAbsoluteThreshold(parseInt(e.target.value, 10))}
          />
        </label>
        <p>Absolute Threshold: {absoluteThreshold}</p>
        </div> */}
      <CameraFeed onFrame={handleFrame}/>
    </div>
  );
};

export default App;

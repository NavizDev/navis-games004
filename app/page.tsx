"use client"
import React, { useState, useRef } from 'react';
import CameraFeed from './components/CameraFeed';
import { detectPixelMovement } from './utils/detectPixelMovement';

const App = () => {
  const [status, setStatus] = useState('Quiet');
  const [threshold, setThreshold] = useState(0.02); // Sensibilidad normalizada
  const [absoluteThreshold, setAbsoluteThreshold] = useState(100000); // Umbral absoluto
  const lastMovementTimeRef = useRef(Date.now());
  const consecutiveMovements = useRef(0);

  const handleFrame = (video : any) => {
    detectPixelMovement(
      video,
      () => {
        consecutiveMovements.current += 1;
        if (consecutiveMovements.current > 2) { // Debe persistir al menos 3 frames
          console.log('Movement detected!');
          setStatus('MOVEMENT DETECTED!');
          lastMovementTimeRef.current = Date.now();
        }
      },
      threshold,
      absoluteThreshold
    );
  };
  
    // Verifica periódicamente si debe volver a "Quiet"
    React.useEffect(() => {
    const interval = setInterval(() => {
        if (Date.now() - lastMovementTimeRef.current > 1000) {
        setStatus('Quiet');
        consecutiveMovements.current = 0; // Reinicia el contador de movimiento
        }
    }, 500);

    return () => clearInterval(interval);
    }, []);


  return (
    <div style={{ textAlign: 'center' }}>
      <h1>LUZ VERDE, LUZ ROJA</h1>
      <h2>Status: {status}</h2>
      <div>
        <label>
          Sensitivity (Normalized Threshold):
          <input
            type="range"
            min="0.001"
            max="0.05"
            step="0.001"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
          />
        </label>
        <p>Normalized Threshold: {threshold.toFixed(3)}</p>

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
        </div>
      {/* <CameraFeed onFrame={handleFrame} /> */}
    </div>
  );
};

export default App;

"use client"
import React, { useEffect, useRef } from 'react';

const CameraFeed = ({ onFrame }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          console.log('Camera setup completed');
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();
  }, []);

  useEffect(() => {
    const processFrames = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        onFrame(videoRef.current);
      }
      requestAnimationFrame(processFrames); // Llama continuamente
    };

    processFrames();
  }, [onFrame]);

  return <div>
    <video ref={videoRef} style={{ width: '100%', height: 'auto', display: 'block' }} />;
  </div>
};

export default CameraFeed;

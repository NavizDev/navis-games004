// /utils/motionDetection.js
import * as bodyPix from '@tensorflow-models/body-pix';

let previousMask = null;

export const detectMovement = async (video, onMovementDetected) => {
  const net = await bodyPix.load();
  const segmentation = await net.segmentPerson(video);

  if (previousMask) {
    const movement = segmentation.allPoses.some((pose, i) => {
      return Math.abs(pose.keypoints[0].position.x - previousMask[i]?.keypoints[0]?.position.x) > 10;
    });

    if (movement) {
      onMovementDetected();
    }
  }

  previousMask = segmentation.allPoses;
};

const loadModel = async () => {
    try {
      const net = await bodyPix.load();
      console.log('Model loaded:', net);
      return net;
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };
  
  // Llama a la función al iniciar la app
  loadModel()
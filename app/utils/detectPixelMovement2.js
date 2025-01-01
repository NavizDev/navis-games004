let previousFrame = null;

export const detectPixelMovement = (video, onMovementDetected) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Captura el frame actual
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height);

  if (previousFrame) {
    let totalDifference = 0;

    for (let i = 0; i < currentFrame.data.length; i += 4) {
      const diff =
        Math.abs(currentFrame.data[i] - previousFrame.data[i]) + // Red
        Math.abs(currentFrame.data[i + 1] - previousFrame.data[i + 1]) + // Green
        Math.abs(currentFrame.data[i + 2] - previousFrame.data[i + 2]); // Blue

      totalDifference += diff;
    }

    // Umbral para detectar movimiento
    if (totalDifference > 4075000) {//2575000
      onMovementDetected();
    }
  }

  previousFrame = currentFrame;
};

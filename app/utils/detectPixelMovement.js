let previousFrame = null;

function smoothImageData(imageData) {
  const smoothedData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;

      for (let channel = 0; channel < 3; channel++) { // RGB channels
        const neighbors = [
          imageData.data[i - 4 + channel],
          imageData.data[i + 4 + channel],
          imageData.data[i - width * 4 + channel],
          imageData.data[i + width * 4 + channel],
          imageData.data[i + channel],
        ];
        smoothedData[i + channel] = Math.round(neighbors.reduce((sum, val) => sum + val, 0) / neighbors.length);
      }
    }
  }

  return new ImageData(smoothedData, width, height);
}

export const detectPixelMovement = (video, onMovementDetected, threshold = 0.01, absoluteThreshold = 50000) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  let currentFrame = context.getImageData(0, 0, canvas.width, canvas.height);

  // Aplica suavizado
  currentFrame = smoothImageData(currentFrame);

  if (previousFrame) {
    let totalDifference = 0;

    for (let i = 0; i < currentFrame.data.length; i += 4) {
      const diff =
        Math.abs(currentFrame.data[i] - previousFrame.data[i]) + // Red
        Math.abs(currentFrame.data[i + 1] - previousFrame.data[i + 1]) + // Green
        Math.abs(currentFrame.data[i + 2] - previousFrame.data[i + 2]); // Blue

      totalDifference += diff;
    }

    const normalizedDifference = totalDifference / (canvas.width * canvas.height);

    if (normalizedDifference > threshold && totalDifference > absoluteThreshold) {
      onMovementDetected();
    }
  }

  previousFrame = currentFrame;
};

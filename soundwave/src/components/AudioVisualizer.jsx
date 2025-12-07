import React, { useRef, useEffect, useState } from "react";

/**
 * AudioVisualizer Component
 * Creates a visual representation of audio frequencies
 *
 * Props:
 * @param {HTMLAudioElement} audioElement - Reference to audio element
 * @param {boolean} isPlaying - Whether audio is playing
 */
function AudioVisualizer({ audioElement, isPlaying }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);

  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize Web Audio API
   * This creates the audio context and connects nodes
   */
  const initializeAudioContext = () => {
    if (isInitialized || !audioElement) return;

    try {
      // Create audio context
      // AudioContext is the main interface for audio processing
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Create analyser node
      // This node allows us to access frequency data
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Size of FFT (Fast Fourier Transform)
      // fftSize determines frequency resolution
      // Smaller = less detail but faster, Larger = more detail but slower

      const bufferLength = analyser.frequencyBinCount;
      // frequencyBinCount = fftSize / 2
      // This is how many frequency bars we'll have

      const dataArray = new Uint8Array(bufferLength);
      // Array to hold frequency data (0-255 values)

      // Create source from audio element
      const source = audioContext.createMediaElementSource(audioElement);

      // Connect the audio graph: source -> analyser -> destination
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // Store references
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      sourceRef.current = source;

      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing audio context:", error);
    }
  };

  /**
   * Draw the visualizer on canvas
   * This function runs continuously to animate the bars
   */
  const draw = () => {
    if (!isPlaying || !analyserRef.current || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    const bufferLength = analyser.frequencyBinCount;

    // Get current frequency data
    // This fills dataArray with current frequency values (0-255)
    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    canvasContext.fillStyle = "rgba(0, 0, 0, 0)";
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate bar width
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    // Draw each frequency bar
    for (let i = 0; i < bufferLength; i++) {
      // Get frequency value (0-255)
      const barHeight = (dataArray[i] / 255) * canvas.height;

      // Create gradient for bar
      const gradient = canvasContext.createLinearGradient(
        0,
        canvas.height - barHeight,
        0,
        canvas.height
      );
      gradient.addColorStop(0, "#a855f7"); // Purple at top
      gradient.addColorStop(1, "#ec4899"); // Pink at bottom

      // Draw the bar
      canvasContext.fillStyle = gradient;
      canvasContext.fillRect(
        x, // x position
        canvas.height - barHeight, // y position (from bottom)
        barWidth, // width
        barHeight // height
      );

      x += barWidth + 1; // Move to next bar position
    }

    // Request next animation frame
    // This creates a smooth animation loop
    animationRef.current = requestAnimationFrame(draw);
  };

  /**
   * Effect: Initialize audio context on first play
   */
  useEffect(() => {
    if (isPlaying && !isInitialized && audioElement) {
      initializeAudioContext();
    }
  }, [isPlaying, audioElement]);

  /**
   * Effect: Start/stop animation based on playing state
   */
  useEffect(() => {
    if (isPlaying && isInitialized) {
      draw();
    } else {
      // Stop animation when paused
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    // Cleanup: Stop animation when component unmounts
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isInitialized]);

  return (
    <div className="mb-6">
      <canvas
        ref={canvasRef}
        width={600}
        height={100}
        className="w-full h-24 bg-gray-900/5 dark:bg-gray-700/30 rounded-xl"
      />
      {!isInitialized && isPlaying && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          Initializing visualizer...
        </p>
      )}
    </div>
  );
}

export default AudioVisualizer;

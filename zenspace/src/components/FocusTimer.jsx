import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function FocusTimer({ onSessionEnd }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(intervalRef.current);
              setIsActive(false);
              if (onSessionEnd) onSessionEnd(25);
              return 0;
            } else {
              setMinutes((prev) => prev - 1);
              return 59;
            }
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, onSessionEnd]);

  const handleStartPause = () => setIsActive(!isActive);
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Focus Timer</h2>
      <motion.div
        animate={minutes === 0 && seconds === 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold text-gray-800 mb-6"
      >
        {formatTime(minutes)}:{formatTime(seconds)}
      </motion.div>
      <div className="flex gap-3">
        <motion.button
          onClick={handleStartPause}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg text-white ${
            isActive
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-indigo-500 hover:bg-indigo-600"
          } transition`}
        >
          {isActive ? "Pause" : "Start"}
        </motion.button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FocusTimer;

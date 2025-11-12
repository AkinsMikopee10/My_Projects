import { useState, useEffect } from "react";

const FocusTimer = ({ setFocusTime }) => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev > 0) {
            if (setFocusTime) setFocusTime((ft) => ft + 1); // increment total seconds
            return prev - 1;
          }
          clearInterval(interval);
          setIsActive(false);
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, setFocusTime]);
  // ... UI remains the same

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h2 className="text-xl font-semibold mb-2">Focus Timer</h2>
      <p className="text-3xl font-mono mb-2">{formatTime(time)}</p>
      <div>
        <button
          onClick={() => setIsActive(!isActive)}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setTime(25 * 60);
            setIsActive(false);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;

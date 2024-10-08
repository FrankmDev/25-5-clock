import { useState, useEffect, useRef } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaPlay,
  FaPause,
  FaUndoAlt,
} from "react-icons/fa";

const BreakLabel = ({ breakLength, setBreakLength }) => {
  return (
    <div className="flex flex-col">
      <label id="break-label">Break Length</label>
      <div className="flex items-center justify-between">
        <button
          id="break-decrement"
          onClick={() => setBreakLength(Math.max(1, breakLength - 1))}
        >
          <FaArrowDown />
        </button>
        <span id="break-length">{breakLength}</span>
        <button
          id="break-increment"
          onClick={() => setBreakLength(Math.min(60, breakLength + 1))}
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

const SessionLabel = ({ sessionLength, setSessionLength }) => {
  return (
    <div className="flex flex-col">
      <label id="session-label">Session Length</label>
      <div className="flex items-center justify-between">
        <button
          id="session-decrement"
          onClick={() => setSessionLength(Math.max(1, sessionLength - 1))}
        >
          <FaArrowDown />
        </button>
        <span id="session-length">{sessionLength}</span>
        <button
          id="session-increment"
          onClick={() => setSessionLength(Math.min(60, sessionLength + 1))}
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

const Timer = ({ timeLeft, isSession }) => {
  return (
    <>
      <label id="timer-label">{isSession ? "Session" : "Break"}</label>
      <p id="time-left" className="text-8xl font-black">
        {timeLeft}
      </p>
    </>
  );
};

const Controls = ({ isRunning, toggleTimer, resetTimer }) => {
  return (
    <div className="flex items-center justify-center gap-5">
      <button id="start_stop" onClick={toggleTimer}>
        {isRunning ? <FaPause /> : <FaPlay />}
      </button>
      <button id="reset" onClick={resetTimer}>
        <FaUndoAlt />
      </button>
    </div>
  );
};

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // en segundos
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(sessionLength * 60);
    }
  }, [sessionLength]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            audioRef.current.play();
            setIsSession(!isSession);
            return isSession ? breakLength * 60 : sessionLength * 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isSession, breakLength, sessionLength]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsSession(true);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <section className="flex flex-col items-center justify-center mx-auto">
      <h1 className="mb-6 text-2xl font-bold">25 + 5 Clock</h1>
      <div className="flex justify-between mb-6 w-full max-w-md">
        <BreakLabel breakLength={breakLength} setBreakLength={setBreakLength} />
        <SessionLabel
          sessionLength={sessionLength}
          setSessionLength={setSessionLength}
        />
      </div>
      <div className="mb-6 text-center">
        <Timer timeLeft={formatTime(timeLeft)} isSession={isSession} />
      </div>
      <Controls
        isRunning={isRunning}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
      />
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </section>
  );
}

export default App;

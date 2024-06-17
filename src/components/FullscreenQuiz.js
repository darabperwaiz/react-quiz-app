import React, { useState, useRef, useEffect } from 'react';
import Quiz from './Quiz';
import './FullscreenQuiz.css';

const FullscreenQuiz = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);
  const quizContainerRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'F11') {
        event.preventDefault();
        if (quizContainerRef.current && !document.fullscreenElement) {
          quizContainerRef.current.requestFullscreen();
        } else if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setQuizCompleted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isFullscreen, quizCompleted]);

  const handleEnterFullscreen = () => {
    if (quizContainerRef.current) {
      quizContainerRef.current.requestFullscreen();
    }
  };

  const handleExitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleRetakeQuiz = () => {
    setTimeLeft(600);
    setQuizCompleted(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div ref={quizContainerRef} className="fullscreen-quiz-container">
      {!isFullscreen && (
        <button onClick={handleEnterFullscreen}>Enter Fullscreen to Start Quiz</button>
      )}
      {isFullscreen && !quizCompleted && (
        <>
          <div className="timer">Time Left: {formatTime(timeLeft)}</div>
          <Quiz onComplete={() => setQuizCompleted(true)} />
          <button onClick={handleExitFullscreen}>Exit Fullscreen</button>
        </>
      )}
      {quizCompleted && (
        <div className="score-section">
          <div>Times Up!</div>
          <Quiz showResultsOnly />
          <button onClick={handleRetakeQuiz}>Retake Quiz</button>
        </div>
      )}
    </div>
  );
};

export default FullscreenQuiz;

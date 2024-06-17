import React, { useState, useEffect } from 'react';

const Quiz = ({ onComplete, showResultsOnly }) => {
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      answer: "Paris"
    },
    {
      question: "Who is the CEO of Tesla?",
      options: ["Jeff Bezos", "Elon Musk", "Bill Gates", "Tony Stark"],
      answer: "Elon Musk"
    },
    {
      question: "What is the smallest prime number?",
      options: ["1", "2", "3", "4"],
      answer: "2"
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const storedCurrentQuestionIndex = localStorage.getItem('currentQuestionIndex');
    const storedUserAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    const storedScore = localStorage.getItem('score');

    if (storedCurrentQuestionIndex !== null) {
      setCurrentQuestion(parseInt(storedCurrentQuestionIndex));
    }

    if (storedUserAnswers && storedScore) {
      setUserAnswers(storedUserAnswers);
      setScore(parseInt(storedScore));
      setQuizCompleted(true);
    }
  }, []);

  const handleAnswerOptionClick = (selectedOption) => {
    const newUserAnswers = { ...userAnswers, [currentQuestion]: selectedOption };
    setUserAnswers(newUserAnswers);

    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      localStorage.setItem('currentQuestionIndex', nextQuestion.toString());
    } else {
      setQuizCompleted(true);
      localStorage.setItem('userAnswers', JSON.stringify(newUserAnswers));
      localStorage.setItem('score', score + 1);
      localStorage.removeItem('currentQuestionIndex');
      if (onComplete) onComplete();
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers({});
    setQuizCompleted(false);
    localStorage.removeItem('userAnswers');
    localStorage.removeItem('score');
    localStorage.removeItem('currentQuestionIndex');
  };

  if (quizCompleted || showResultsOnly) {
    return (
      <div className="score-section">
        <div>You scored {score} out of {questions.length}</div>
        {quizCompleted && <button onClick={handleRetakeQuiz}>Retake Quiz</button>}
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="question-section">
        <div className="question-count">
          <span>Question {currentQuestion + 1}</span>/{questions.length}
        </div>
        <div className="question-text">{questions[currentQuestion].question}</div>
      </div>
      <div className="answer-section">
        {questions[currentQuestion].options.map((option, index) => (
          <button key={index} onClick={() => handleAnswerOptionClick(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;

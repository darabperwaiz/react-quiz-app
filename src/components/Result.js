import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => setQuestions(data));

    const savedAnswers = JSON.parse(localStorage.getItem('answers'));
    if (savedAnswers) setAnswers(savedAnswers);
  }, []);

  useEffect(() => {
    if (questions.length > 0 && Object.keys(answers).length > 0) {
      let newScore = 0;
      questions.forEach((question, index) => {
        if (answers[index] === question.answer) {
          newScore += 1;
        }
      });
      setScore(newScore);
    }
  }, [questions, answers]);

  const handleRetake = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <h1>Your Score: {score}/{questions.length}</h1>
      <button onClick={handleRetake}>Retake Quiz</button>
    </div>
  );
};

export default Result;

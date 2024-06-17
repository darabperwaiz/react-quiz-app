import React from 'react';
import './App.css';
// import Quiz from './components/Quiz';
import FullscreenQuiz from "./components/FullscreenQuiz";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Quiz App</h1>
        <FullscreenQuiz />
      </header>
    </div>
  );
}

export default App;

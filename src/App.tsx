import React from 'react';
import logo from './logo.svg';
import './App.css';
import { GameBoard } from './GameBoard';

function keyPresses(event: React.KeyboardEvent) {
  console.log(event);
}

function App() {
  return (
    <div>
      <div className="GameTop">
        <div>&lt;&lt;</div>
        <div className="TopText">
          Sokunoku
        </div>
        <div>>></div>
      </div>
      <div onKeyDown={keyPresses} className="App">
        <GameBoard />
      </div>
      </div>
);
}

export default App;

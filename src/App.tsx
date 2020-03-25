import React from 'react';
import logo from './logo.svg';
import './App.css';
import { GameBoard } from './GameBoard';

function keyPresses(event: React.KeyboardEvent) {
    console.log(event);
}

function App() {
  return (
    <div onKeyDown={keyPresses} className="App">
        <GameBoard />
    </div>
  );
}

export default App;

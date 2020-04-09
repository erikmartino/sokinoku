import React from 'react';
import './game.css';
import 'GameBoard';

class Props {

}

class LevelCollections {

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
  

export class GameTop extends React.Component<Props, LevelCollections> {
    render(): React.ReactElement {
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
          };
}
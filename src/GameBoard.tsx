import React from 'react';
import './game.css';

interface Props {

}

interface State {

}

export class GameBoard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {}
    }

    column(j: number): React.ReactElement[] {
        let column = [];
        for (let i = 0; i < 10; i++) {
            let key = `(${i},${j})`;
            column.push(<div className="block" key={key} />);
        }
        return column;
    }

    arow(): React.ReactElement[] {
        let rows = [];
        for (let j = 0; j < 10; j++) {
            rows.push(<div key={j}>{this.column(j)}</div>);
        }
        return rows;
    }

    render(): React.ReactElement {
        let rows = this.arow();
        console.log("msg: " + rows);
        return <div className="game_board">
            {rows}
        </div>;
    }
}

// for (let i = 0; i < 10; i++) {
//     return <tr>
//         {() => {
//             for (let j = 0; j < 10; j++) {
//                 return <td>{i + j}</td>;
//             }
//         }}
//     </tr>
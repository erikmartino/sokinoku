import React from 'react';
import './game.css';


function parseBoard(board: string) {
    let rows: string[] = board.split(/\r?\n/);
}

class Piece {
    constructor(x: number, y: number, piece: string) {
        this.x = x;
        this.y = y;
        this.piece = piece;
    }

    x: number;
    y: number;
    piece: string;
}

interface Props {

}


enum DIRECTION {
    RIGHT, UP, LEFT, DOWN
}

class GameState {
    constructor() {
        this.width = 8;
        this.height = 9;
        this.board = //
            `########
#####  #
#   $  #
#  .#  #
## ## ##
#      #
# @#   #
#  #####
########`;
        this.pieces = [];
        this.extractPieces('.');
        this.extractPieces('@');
        this.extractPieces('$');
    }

    extractPieces(p: string) {
        let pieces = this.pieces;
        let board = this.board;

        let index: number = 0;
        for (; ;) {
            index = board.indexOf(p, index + 1);
            if (index < 0) {
                break;
            }
            let x = index % (this.width + 1);
            let y = (index - x) / (this.width + 1);
            console.log(x + "," + y + " " + p)

            pieces.push(new Piece(x, y, p));
        }

        board = board.replace(p, ' ');
        this.board = board;
        this.pieces = pieces;
    }

    width: number;
    height: number;
    board: string;
    pieces: Piece[];

    tiles(x: number, y: number): string {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return "";
        }

        return this.board[x + (this.width + 1) * y];
    }

    move(dir: DIRECTION): void {
        this.pieces.filter(p => p.piece === '@').forEach(p => {
            let x = p.x;
            let y = p.y;

            switch (dir) {
                case DIRECTION.RIGHT:
                    x++;
                    break;
                case DIRECTION.UP:
                    y--;
                    break;
                case DIRECTION.LEFT:
                    x--;
                    break;
                case DIRECTION.DOWN:
                    y++;
                    break;
            }

            if (this.tiles(x, y) !== ' ') {
                return;
            }

            p.x = x;
            p.y = y;


            console.log('move ' + p.x + ',' + p.y);
        });
    }
}


const CLASSNAMES: { [key: string]: string; } = {
    "#": "wall",
    " ": "floor",
    "@": "player",
    "$": "crate",
    ".": "endpoint",
};

interface GameRules {
    width: number;
    height: number;
    board: string;
    pieces: Piece[];

    move(dir: DIRECTION): void;

    tiles(x: number, y: number): string;
}

class State {
    constructor() {
        this.n = 0;
    }
    n: number;
    incr() {
        this.n++;
        return this;
    }
}

export class GameBoard extends React.Component<Props, GameState> {
    private keyDown: (e: KeyboardEvent) => void;
    private game: GameState;

    constructor(props: Props) {
        super(props);
        this.game = new GameState();
        this.setState(this.game);
        this.keyDown = (e: KeyboardEvent) => {
            this.keyPresses(e);
        }
    }

    keyPresses(event: KeyboardEvent) {
        switch (event.code) {
            case "ArrowRight":
                this.game.move(DIRECTION.RIGHT);
                break;
            case "ArrowUp":
                this.game.move(DIRECTION.UP);
                break;
            case "ArrowLeft":
                this.game.move(DIRECTION.LEFT);
                break;
            case "ArrowDown":
                this.game.move(DIRECTION.DOWN);
                break;
            default:
                console.log(event.code);
        }
        this.setState(this.game);
    }

    componentDidMount() {
        document.body.addEventListener('keydown', this.keyDown);
    }

    componentWillUnmount(): void {
        document.body.removeEventListener('keydown', this.keyDown);
    }

    renderedTiles(): React.ReactElement[] {
        let cells: React.ReactElement[] = []
        for (let i = 0; i < this.game.height; i++) {
            for (let j = 0; j < this.game.width; j++) {
                let p = this.game.tiles(j, i);
                let classNames = CLASSNAMES[p];
                cells.push(<div key={i + ',' + j} className={classNames}/>);
            }
        }
        return cells;
    }

    renderedPieces(): React.ReactElement[] {
        let pieces: React.ReactElement[] = []
        this.game.pieces.forEach(p => {
            let classNames = CLASSNAMES[p.piece];
            let style = {left: 64 * p.x + 'px', top: 64 * p.y + 'px'};
            pieces.push(<div key={encodeURI(p.piece)+'p' + p.x + ',' + p.y} className={classNames} style={style}/>)
        });
        console.log(pieces);
        return pieces;
    }

    render(): React.ReactElement {
        return <div className='game'>
            <div key='game_board' className="game_board">
                {this.renderedTiles()}
            </div>
            <div key='pieces' className='game_pieces'>
                {this.renderedPieces()}
            </div>
        </div>;
    }
}

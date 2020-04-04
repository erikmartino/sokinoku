import React from 'react';
import './game.css';

import { Level } from './Levels';


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

    isPlayer(): boolean {
        return this.piece === '@';
    }

    isMovable(): boolean {
        return this.piece === '$';
    }

    isEndpoint(): boolean {
        return this.piece === '.';
    }

    isBlocking(): boolean {
        return this.isMovable();
    }
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

    isFloor(x: number, y: number): boolean {
        return this.tiles(x, y) === ' ';
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

        board = board.replace(p, ' '); // floor
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

    piece(x: number, y: number): Piece[] {
        return this.pieces.filter(p => p.x === x && p.y === y);
    }

    /**
     * Is the tile a floor where nothing is blocking a box
     * @param x
     * @param y
     */
    isFree(x: number, y: number): boolean {
        return (this.isFloor(x, y) && this.piece(x, y).filter(bp => bp.isBlocking()).length === 0);
    }

    move(dir: DIRECTION): void {
        let p = this.pieces.filter(p => p.isPlayer())[0];
        // current player position
        let x = p.x;
        let y = p.y;

        // set position to the cell in the given direction
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

        // we can only move on floor
        if (!this.isFloor(x, y)) {
            return;
        }

        // push direction
        let dx = x - p.x;
        let dy = y - p.y;


        // if anything is pushed, where to
        let mx = x + dx;
        let my = y + dy;

        // is something movable blocking the push destination
        if (this.piece(x, y).filter(pc => pc.isMovable()).length > 0) { // if anything is movable blocked
            if (!this.isFree(mx, my)) { // is it possible to push the box
                return;
            }
        }

        // move anything movable
        this.piece(x, y)
            .filter(pc => pc.isMovable())
            .forEach(pc => {
                pc.x = mx;
                pc.y = my;
            });

        // move player
        p.x = x;
        p.y = y;
        console.log('move ' + p.x + ',' + p.y);
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
            pieces.push(<div key={encodeURI(p.piece) + 'p' + p.x + ',' + p.y} className={classNames} style={style}/>)
        });
        console.log(pieces);
        return pieces;
    }

    render(): React.ReactElement {
        return <div className='game' title="Board">
            <div key='game_board' className="game_board">
                {this.renderedTiles()}
            </div>
            <div key='pieces' className='game_pieces'>
                {this.renderedPieces()}
            </div>
        </div>;
    }
}

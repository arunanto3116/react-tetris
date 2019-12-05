import React,{Component} from 'react';
import './App.css';

class App extends Component {

    constructor(){
        super();

        let A = [4,4,3,
                 4,4,3,
                 4,3,3];

        let B = [3,4,4,
                 3,4,4,
                 3,3,4];

        let C = [4,4,4,
                 4,3,4,
                 3,3,3];

        let D = [4,4,4,
                 4,3,3,
                 3,3,4];

        let E = [4,4,4,
                 3,3,4,
                 4,3,3];

        let F = [3,3,4,
                 3,3,4,
                 4,4,4];

        let G = [4,4,4,
                 3,3,3,
                 4,4,4];

        let tetrominos = [A,B,C,D,E,F,G];
        let color = {
            background: "#5c2a3b",      // background
            wall: "#d83c66",            // walls
            solid: "#49b5ab",           // solid tetromino
            tetromino: "#e97539"        // falling tetromino
        };
        let height = 20;
        let width = 30;
        let square_size = 17;           // square size in pixels
        let current = this.make_random(tetrominos);
        let next    = this.make_random(tetrominos);
        let well = new Array(height);
        let initialPosition = {x: 0, y: Math.floor(width/2)};
        for (let index = 0; index < well.length; index++) {
            well[index] = new Array(width);
        }
        // initialise well
        for (let i = 0; i < well.length; i++) {
            for (let j = 0; j < width; j++) {
                well[i][j] = 0;
            }
        }
        // add wall
        for (let i = 0; i < well.length; i++) {
            for (let j = 0; j < width; j++) {
                if(j == 0 || j == width-1){
                    // Side walls
                    well[i][j] = 1;
                }
                if(i==height-1){
                    // Bottom wall
                    well[i][j] = 2;
                }
            }
        }

        this.state =  {
            tetrominos,
            height,
            width,
            square_size,
            color,
            well,
            current,
            next,
            initialPosition,
            currentPosition:initialPosition,
            repeater:null
        }
    }

    componentDidMount(){
        this.startGame();
    }

    startGame(){
        let repeater = setInterval(() => {
            this.draw();
        }, 50);
        this.setState({repeater});
    }

    resetWall = (clearSolids = false) => {
        let {well,width} = this.state;
        for (let i = 0; i < well.length; i++) {
            for (let j = 0; j < width; j++) {
                if(well[i][j]==3 || well[i][j]==4 ||(clearSolids && well[i][j]==-1)){
                    well[i][j] = 0;
                }
            }
        }
        this.setState({well});
    }

    detectCollision(well){
        let {width} = this.state;
        let collision = false;
        for (let i = 1; i < well.length; i++) {
            if(collision){
                break;
            }
            for (let j = 0; j < width; j++) {
                if(well[i][j]==1 || well[i][j]==2 || well[i][j]==-1){
                   if(well[(i-1)][j]==3){
                        collision = true;
                        break;
                   }
                }
            }
        }
        return collision;
    }

    paste(well){
        let {width} = this.state;
        for (let i = 0; i < well.length; i++) {
            for (let j = 0; j < width; j++) {
                if(well[i][j]==3){
                    well[i][j] = -1;
                }
            }
        }
        return well;
    }

    draw = () => {

        if(this.checkGameOver()){
            setTimeout(() => { this.restartGame(); }, 300);
        }else{

            this.resetWall();
            let {well,current,height,tetrominos} = this.state;
            let {x,y} = this.state.currentPosition;
            this.setState({current:current});
            let tetrominoRow = 2;
            let tetrominoColumn = 7;
            let tetroIndex = x;
            // debugger
            while(tetroIndex >=0 && tetrominoRow >= 0){
                if(tetroIndex < (height-1)){
                    // debugger
                    if(well[tetroIndex][y] != (-1 || 1 || 2)){
                         well[tetroIndex][y] = current[tetrominoColumn];
                    }
                    if(well[tetroIndex][(y-1)] != (-1 || 1 || 2)){
                         well[tetroIndex][(y-1)] = current[(tetrominoColumn-1)];
                    }
                    if(well[tetroIndex][(y+1)] != (-1 || 1 || 2)){
                     well[tetroIndex][(y+1)] = current[(tetrominoColumn+1)];
                    }
                }
                tetrominoColumn -= 3;
                tetrominoRow--;
                tetroIndex--;
            }
            let newState;
            if(this.detectCollision(well)){
                x = 0;
                well = this.paste(well);
                current = this.make_random(tetrominos);
                newState = {currentPosition: {...this.state.currentPosition,x,y},well,current};
            }else{
                x+=1;
                newState = {currentPosition: {...this.state.currentPosition,x,y},well};
            }
            this.setState(newState);
        }

    }

    restartGame(){
        window.clearInterval(this.state.repeater);
        this.setState({repeater:null});
        this.resetWall(true);
        this.startGame();
    }

    checkGameOver(){
        let {well} = this.state;
        let gameOverStatus = false;
        for (let j = 1; j < well.length; j++) {
            if(well[0][j] == -1){
                gameOverStatus = true;
                break;
            }
        }
        return gameOverStatus;
    }

    make_random = (tetrominos) => {
        // 1.) Select random tetromino from tetrominos array by index
        let index = Math.floor((Math.random() * tetrominos.length));
        //let index = this.getRandomIntInclusive(0,1);
        // 2.) Copy it into current array (avoid reference assignment)
        return [...tetrominos[ index ]];
    }

    getRandomIntInclusive = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    drawWell = () => {
        let board = [];
        // Draw well
        for (let i = 0; i < this.state.well.length; i++) {
            for (let j = 0; j < this.state.width; j++) {
                let bgStyle = {
                    position: 'absolute',
                    left: j*this.state.square_size + 'px',
                    top: i*this.state.square_size + 'px',
                    width: this.state.square_size + 'px',
                    height: this.state.square_size + 'px',
                    zIndex: 0
                };
                bgStyle.backgroundColor = this.state.color.background;
                if(this.state.well[i][j] == 1 || this.state.well[i][j] == 2){
                    //wall
                    bgStyle.backgroundColor = this.state.color.wall;
                }else if(this.state.well[i][j] == 3){
                    // falling object
                    bgStyle.backgroundColor = this.state.color.tetromino;
                }
                else if(this.state.well[i][j] == -1){
                    // pasted object
                    bgStyle.backgroundColor = this.state.color.solid;
                }
                if(this.state.well[i][j] == -1 || this.state.well[i][j] == 3){
                    bgStyle.borderStyle = 'double';
                }
                let uniqueId = `row${i}column${j}`;
                board.push(<div id={uniqueId} key={uniqueId} style={bgStyle}></div>);
            }
        }
        //console.log(this.state.well);
        return (board);
    };

    render(){
        return (
              <div className="App">
                <div className="tetris-container">
                    {this.drawWell()}
                </div>
              </div>
        );
    }

}

export default App;

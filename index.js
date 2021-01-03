
var x = document.getElementById("myAudio"); 

function playAudio() { 
  x.play(); 
} 

function pauseAudio() { 
  x.pause(); 
} 


const easy_btn = document.getElementsByClassName('easy')[0]
const medium_btn = document.getElementsByClassName('medium')[0]
const hard_btn = document.getElementsByClassName('hard')[0]

let start = document.createElement('div');
let go = false
let rend = 0
let isHidden = document.getElementById('modal').style.display
let mode;

easy_btn.addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden")
    document.get
    go = true
    mode = {
        blank: 90,
        food: 95,
        ratio: 4
    }
})

medium_btn.addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden")
        go = true
        mode = {
        blank: 85,
        food: 90,
        ratio: 4
    }
})

hard_btn.addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden")
    go = true
    mode = {
        blank: 80,
        food: 85,
        ratio: 4
    }
})



window.addEventListener('click', (event) => {  

    debugger
    let canvas = document.getElementById("game");
    let c = canvas.getContext('2d');

    canvas.style.background = '#060208'

    
    if(go && event.target.id === 'continue'){
        c.clearRect(0, 0, canvas.width, canvas.height);
        go = false
        board = null; //new Grid(15, 15, "#060208")
        player = null; // new GamePiece(board, "#c95ed1")
        document.getElementById("modal").classList.remove("hidden")
        document.getElementById("game-over").classList.add("hidden")
        document.getElementById("winner").classList.add("hidden")
        

    } else if (go && event.target.id === 'dif-select' ){

        c.font = "40px VT323";
        c.fillStyle = "#ffffff";
        c.fillText("REMEMBER", canvas.width * .42, canvas.height * .25);
            
        c.font = "20px VT323";
        c.fillStyle = "#ffffff";
        c.fillText("* press . to start a new map", 125, 250);
        c.fillText("* press x to return to menu", 125, 275);

    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });

    document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
    });

    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
        }
        draw(){
            c.fillStyle = this.color
            c.fillRect(this.x, this.y, this.width, this.height)
        }
    }

    class Player {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
        }

        draw() {
            c.fillStyle = this.color
            c.fillRect(this.x - 1, this.y - 1, this.width, this.height)
        }
    }

    class Grid {
        constructor(width, height, color) {
            this.width = width
            this.height = height
            this.x = 0
            this.y = 30
            this.blocks = []
            this.count = 0;
            this.moves = 0;
            this.controls = true;
            for (let q = 0; this.y < canvas.height; q++) {
                for (let q = 0; this.x < canvas.width; q++) {
                    let block;
                    let drop = Math.random() * 100
                    if (drop < mode.blank) {
                    // if (drop < 85) {
                        block = new Rectangle(this.x, this.y, this.height, this.width, color) // open space
                    // } else if (drop < 90) {
                    } else if (drop < mode.food) {
                        this.count += 1;
                        this.moves += mode.ratio;
                        block = new Rectangle(this.x, this.y, this.height, this.width, '#f5baff') //food
                    } else {
                        block = new Rectangle(this.x, this.y, this.height, this.width, '#59235c') // wall
                    }
                    this.blocks.push(block)
                    this.x += this.width
                }
                this.y += this.height
                this.x = 0
            }
        }

        top() {
            c.fillRect(0, 0, 420, 30)
            c.fillStyle = '#f5baff'
            c.fillStyle = "#59235c";
            c.font = '15px VT323'
            c.fillStyle = '#060208'
            c.fillText("REMAINING MOVES: " + this.moves, 15, 20), 30
            c.fillText("REMAINING NODES: " + this.count, 242, 20), 30
        }

        draw() {
            this.top()
            for (let b = 0; b < this.blocks.length; b++) {
                this.blocks[b].draw()
            }
        }
    }

    class GamePiece {
        constructor(grid, color) {
            this.grid = grid
            this.body = new Player(0, 0, this.grid.width, this.grid.height, color)
            this.location = this.grid.blocks[(this.grid.blocks.length / 2 )]
            this.origin = this.location
            this.prev = this.origin
        }

        draw() {
            this.control()
            this.body.x = this.location.x + this.location.width / 15
            this.body.y = this.location.y + this.location.height / 15
            this.body.draw()
        }

        control() {
            if (keysPressed['w']) {
                this.body.y -= this.grid.height
            } else if (keysPressed['s']) {
                this.body.y += this.grid.height
            } else if (keysPressed['a']) {
                this.body.x -= this.grid.width
            } else if (keysPressed['d']) {
                this.body.x += this.grid.width
            }

            for (let g = 0; g < this.grid.blocks.length; g++) { // runs through grid
                //location properties
                let playerEdgeX = this.body.x
                let playerEdgeY = this.body.y
                let boxLeftEdge = this.grid.blocks[g].x;
                let boxRightEdge = this.grid.blocks[g].x + this.grid.blocks[g].width;
                let boxBottomEdge = this.grid.blocks[g].y;
                let boxTopEdge = this.grid.blocks[g].y + this.grid.blocks[g].height;
                // color properties
                let box = this.grid.blocks[g]
                let openSpace = '#060208';
                let trail = '#81d8de';
                let off = '#f5baff';
                let on = '#d903ff';




                if (playerEdgeX > boxLeftEdge && playerEdgeX < boxRightEdge)
                    // if x is between box left and right
                    if (playerEdgeY > boxBottomEdge && playerEdgeY < boxTopEdge) {
                        // if y is between  box top and bottom
                        if (this.grid.moves < 0) {
                            // check lose condition
                            c.clearRect(0, 0, canvas.width, canvas.height);
                            // document.getElementById("game").classList.add("hidden")
                            document.getElementById("game-over").classList.remove("hidden")    
                            break
                        } else if (this.grid.count < 1 && this.grid.moves >= 0) {
                            // check win condition
                            c.clearRect(0, 0, canvas.width, canvas.height);
                            // document.getElementById("game").classList.add("hidden")
                            document.getElementById("winner").classList.remove("hidden") 
                            break
                            //  document.getElementById("winner").classList.remove("hidden")
                        }


                        switch (box.color) {
                            case openSpace: // dark purple
                                box.color = trail // cyan
                                this.location = box;
                                this.grid.moves -= 1;
                                return this.location; //location = cyan
                            case off: // pink
                                this.grid.count -= 1
                                this.grid.moves -= 1
                                box.color = on // bright purple
                                this.location = box;
                                return this.location
                        }
                    }
            }
        }
    }




    let board = new Grid(15, 15, "#060208")
    let player = new GamePiece(board, "#c95ed1")

    document.addEventListener('keydown', (e) => {
        if (e.key === '.' && isHidden === '') {
            board = {}
            player = {}
            board = new Grid(15, 15, "#060208")
            player = new GamePiece(board, "#c95ed1")
            board.draw()
            player.draw()
        } else if (e.key === 'x' && isHidden === ''){
            go = false
            board = null; //new Grid(15, 15, "#060208")
            player = null; // new GamePiece(board, "#c95ed1")
            document.getElementById("modal").classList.remove("hidden")
            c.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            board.draw()
            player.draw()
        }
    });
    }

}
)    
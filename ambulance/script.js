var map = [];
var path = [];
var btns = [];


function initButtons() {
    btns = [];
    for (var r = 0; r < 9; r++) {
        var row = [];
        for (var c = 0; c < 16; c++) {
            row.push(0);
        }
        map.push(row);
    }
    const gridContainer = document.getElementById('grid-container');
    for (let i = 0; i < 9; i++) {
        var row = [];
        for (let j = 0; j < 16; j++) {
            const square = document.createElement('button');
            square.classList.add('square');
            square.classList.add('btn');
            square.classList.add('btn-light');
            square.onclick = function () {
                if (square.textContent == "") {
                    square.textContent = "Block";
                    square.style.backgroundColor = "red";
                    map[i][j] = 1;
                } else if (square.textContent == "Block") {
                    square.textContent = "Start";
                    square.style.backgroundColor = "green";
                    map[i][j] = 0;
                } else if (square.textContent == "Start") {
                    square.textContent = "End";
                    square.style.backgroundColor = "white";
                    map[i][j] = 0;
                } else {
                    square.textContent = "";
                    square.style.backgroundColor = "rgb(44, 139, 255)";
                    map[i][j] = 0;
                }
            };
            row.push(square);
            gridContainer.appendChild(square);
        }
        btns.push(row);
    }
}

document.addEventListener("DOMContentLoaded", initButtons());

async function run() {
    map = []
    path = []
    var startCount = 0;
    var endCount = 0; 
    for(var i = 0; i < 9; i++){
        var hold = []
        for(var j = 0; j < 16; j++){
            if(btns[i][j].textContent == "Block"){
                hold.push(1);
            }
            else{
                hold.push(0);
            }
            if(btns[i][j].textContent == "Start"){
                startCount++;
                start_x = i+1;
                start_y = j+1;
            }
            if(btns[i][j].textContent == "End"){
                endCount++;
                end_x = i+1;
                end_y = j+1;
            }
        }
        map.push(hold);
    }
    if(!(startCount == 1 && endCount == 1)){
        alert(
            "Invalid Path!\n" +
            "Possible problems:\n" +
            "You may have multiple start and end positions\n"+
            "You may not have specified a start or end position"
    );
        return;
    }

    djikstra();
    console.log(map);   
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 16; j++) {
            if(btns[i][j].style.backgroundColor == "gray"){
                btns[i][j].style.backgroundColor = "rgb(44, 139, 255)";
                btns[i][j].innerText = "";
            }
        }
    }
    //go over path
    for(var i = 1; i < path.length - 1; i++){
        var x = path[i][0];
        var y = path[i][1];
        if (btns[x][y].innerText == ""){
            var text = direct(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]);
            btns[x][y].style.backgroundColor = "gray";
            btns[x][y].innerText = text;
            btns[x][y].style.width = "55px";
            btns[x][y].style.height = "55px";
            await sleep(50);
            btns[x][y].style.width = "50px";
            btns[x][y].style.height = "50px";
        }
        if(btns[x][y].innerText == "Block"){
            var text = direct(path[i][0], path[i][1], path[i+1][0], path[i+1][1]);
            btns[x][y].style.backgroundColor = "yellow";
            btns[x][y].innerText = text;
            btns[x][y].style.width = "55px";
            btns[x][y].style.height = "55px";
            await sleep(50);
            btns[x][y].style.width = "50px";
            btns[x][y].style.height = "50px";
        }
        //alert("HEY" + btns[x][y].style.backgroundColor);

        
    }
}

function direct(x, y, x2, y2){
    if(x == x2 && y < y2){
        return "→";
    } else if(x == x2 && y > y2){
        return "←";
    } else if(x < x2){
        return "↓";
    } else {
        return "↑";
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function djikstra() {
    // Read the grid from standard input
    var noPaths;
    const ROWS = 9;
    const COLS = 16;
    start_x--; start_y--; end_x--; end_y--;
    if (start_x < 0 || start_x >= ROWS || start_y < 0 || start_y >= COLS ||
        end_x < 0 || end_x >= ROWS || end_y < 0 || end_y >= COLS) {
        alert("Invalid start or end position.");
    }
    for (let i = 0; i < ROWS; ++i) {
        for (let j = 0; j < COLS; ++j) {
            if (map[i][j] === 1) {
                map[i][j] = 100000000;
            }
            else {
                map[i][j] = 1;
            }
        }
    }

    // Initialize auxiliary arrays
    const distmap = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Infinity));
    distmap[start_x][start_y] = 0;
    const originmap = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => -1));
    const visited = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => false));
    let finished = false;
    let x = start_x, y = start_y;
    let count = 0;

    // Loop Dijkstra until reaching the target cell
    while (!finished) {
        // Move to x+1, y
        if (x < ROWS - 1) {
            if (distmap[x + 1][y] > map[x + 1][y] + distmap[x][y] && !visited[x + 1][y]) {
                distmap[x + 1][y] = map[x + 1][y] + distmap[x][y];
                originmap[x + 1][y] = x * COLS + y;
            }
        }
        // Move to x-1, y
        if (x > 0) {
            if (distmap[x - 1][y] > map[x - 1][y] + distmap[x][y] && !visited[x - 1][y]) {
                distmap[x - 1][y] = map[x - 1][y] + distmap[x][y];
                originmap[x - 1][y] = x * COLS + y;
            }
        }
        // Move to x, y+1
        if (y < COLS - 1) {
            if (distmap[x][y + 1] > map[x][y + 1] + distmap[x][y] && !visited[x][y + 1]) {
                distmap[x][y + 1] = map[x][y + 1] + distmap[x][y];
                originmap[x][y + 1] = x * COLS + y;
            }
        }
        // Move to x, y-1
        if (y > 0) {
            if (distmap[x][y - 1] > map[x][y - 1] + distmap[x][y] && !visited[x][y - 1]) {
                distmap[x][y - 1] = map[x][y - 1] + distmap[x][y];
                originmap[x][y - 1] = x * COLS + y;
            }
        }

        visited[x][y] = true;
        // Find the next cell with the shortest distance
        let min_dist = Infinity;
        for (let i = 0; i < ROWS; ++i) {
            for (let j = 0; j < COLS; ++j) {
                if (!visited[i][j] && distmap[i][j] < min_dist) {
                    min_dist = distmap[i][j];
                    x = i;
                    y = j;
                }
            }
        }
        if (x === end_x && y === end_y) {
            finished = true;
        }
        count++;
    }

    // Backtrack to print the path
    x = end_x;
    y = end_y;
    if (distmap[end_x][end_y] >= 1e8 && noPaths) {
        alert("No possible path!");
    }
    else {
        if(distmap[end_x][end_y] >= 1e8 && !noPaths){
            alert("Only path is to go over blocks, here is the most optimal path");
        }
        // console.log("The shortest path is: ");
        path.push([x, y]);
        while (x !== start_x || y !== start_y) {
            const prev_x = Math.floor(originmap[x][y] / COLS);
            const prev_y = originmap[x][y] % COLS;
            path.push([prev_x, prev_y]);
            x = prev_x;
            y = prev_y;
        }
        path.reverse();
        for (let i = 0; i < path.length; i++) {
            //alert(`(${1+path[i][0]},${1+path[i][1]})`);
            map[path[i][0]][path[i][1]] = 2;
        }
        // console.log();
        // for(let i = 0; i < 9; i++){
        //     for(let j = 0; j < 16; j++){
        //         if(map[i][j] !== 1 && map[i][j] !== 2){
        //             process.stdout.write("1 ");
        //         }
        //         else if(map[i][j] === 1){
        //             process.stdout.write("0 ");
        //         }
        //         else{
        //             process.stdout.write(`${map[i][j]} `);
        //         }
        //     }
        //     console.log();
        // // } 
        // // Output the length of the shortest path
        // console.log(`The length of the shortest path is: ${distmap[end_x][end_y]}`);
        //alert(distmap[end_x][end_y]);
    }
}

async function clearBtn() {
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 16; c++) {
            map[r][c] = 0;
        }
    }
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 16; c++) {
            btns[r][c].style.backgroundColor = "rgb(44, 139, 255)";
            btns[r][c].textContent = "";
        }
    }
}

async function clearPath() {
    for(var i = path.length - 1; i > -1; i--){
        var x = path[i][0];
        var y = path[i][1];
        if (btns[x][y].innerText != "Start" && btns[x][y].innerText != "End" && btns[x][y].innerText != "Block" && btns[x][y].style.backgroundColor != "yellow") {
            btns[x][y].style.backgroundColor = "rgb(44, 139, 255)";
            btns[x][y].innerText = "";
            btns[x][y].style.width = "55px";
            btns[x][y].style.height = "55px";
            await sleep(50);
            btns[x][y].style.width = "50px";
            btns[x][y].style.height = "50px";
        }
        else if(btns[x][y].style.backgroundColor == "yellow"){
            btns[x][y].style.backgroundColor = "red";
            btns[x][y].innerText = "Block";
            btns[x][y].style.width = "55px";
            btns[x][y].style.height = "55px";
            await sleep(50);
            btns[x][y].style.width = "50px";
            btns[x][y].style.height = "50px";
        }
    }
}

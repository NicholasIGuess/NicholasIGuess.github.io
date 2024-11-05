var shortBreak = 300;
var longBreak = 1800;
var pomodoro = 1500;
var timer = pomodoro;
var currentPhase = 0;
var numBreaks = 0;
var breakAmount = 4;
var timerInterval;

var startBtn = document.getElementById("start");
var pauseBtn = document.getElementById("pause");
var resetBtn = document.getElementById("reset");

function secondsToTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    if (s < 10) {
        s = "0" + s;
    }
    return m + ":" + s;
}

function start() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timer = pomodoro;
    currentPhase = 0;
    document.getElementById("count").innerHTML = secondsToTime(timer);
    document.getElementById("phase").innerHTML = "started!";
    document.getElementsByClassName("timer")[0].style.backgroundColor = "#ff4747";
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById("count").innerHTML = secondsToTime(timer);
        document.getElementById("phase").innerHTML = currentPhase == 0 ? "get to work!" : currentPhase == 1 ? "take a break!" : "nice, a long break!";
        document.title = secondsToTime(timer) + " - hackmato";
        if (timer == 0) {
            if (currentPhase == 0) {
                currentPhase = 1;
                timer = shortBreak;
                numBreaks++;
            } else if (currentPhase == 1) {
                if (numBreaks == breakAmount) {
                    currentPhase = 2;
                    timer = longBreak;
                    numBreaks = 0;
                } else {
                    currentPhase = 0;
                    timer = pomodoro;
                }
            } else if (currentPhase == 2) {
                currentPhase = 0;
                timer = pomodoro;
            }
            document.getElementById("phase").innerHTML = currentPhase == 0 ? "get to work!" : currentPhase == 1 ? "take a break!" : "nice, a long break!";
            document.getElementsByClassName("timer")[0].style.backgroundColor = currentPhase == 0 ? "#ff4747" : currentPhase == 1 ? "#88ff88" : "#47a9ff";
            document.getElementById("count").innerHTML = secondsToTime(timer);
        }
    }, 1000);
}

function pause() {
    if (timerInterval != null) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById("phase").innerHTML = "paused :(";
        document.title = "paused - hackmato";
        document.getElementById("pause").innerHTML = "resume";
    } else {
        document.getElementById("phase").innerHTML = "resumed!";
        document.getElementById("pause").innerHTML = "pause";
        timerInterval = setInterval(() => {
            timer--;
            document.getElementById("phase").innerHTML = currentPhase == 0 ? "get to work!" : currentPhase == 1 ? "take a break!" : "nice, a long break!";
            document.getElementById("count").innerHTML = secondsToTime(timer);
            document.title = secondsToTime(timer) + " - hackmato";
            if (timer == 0) {
                if (currentPhase == 0) {
                    currentPhase = 1;
                    timer = shortBreak;
                    numBreaks++;
                } else if (currentPhase == 1) {
                    if (numBreaks == breakAmount) {
                        currentPhase = 2;
                        timer = longBreak;
                        numBreaks = 0;
                    } else {
                        currentPhase = 0;
                        timer = pomodoro;
                    }
                } else if (currentPhase == 2) {
                    currentPhase = 0;
                    timer = pomodoro;
                }
                document.getElementById("phase").innerHTML = currentPhase == 0 ? "get to work!" : currentPhase == 1 ? "take a break!" : "nice, a long break!";
                document.getElementsByClassName("timer")[0].style.backgroundColor = currentPhase == 0 ? "#ff4747" : currentPhase == 1 ? "#88ff88" : "#47a9ff";
                document.getElementById("count").innerHTML = secondsToTime(timer);
            }
        }, 1000);
    }
}

function reset() {
    clearInterval(timerInterval);
    timer = pomodoro;
    currentPhase = 0;
    document.getElementById("count").innerHTML = secondsToTime(timer);
    document.getElementById("phase").innerHTML = "press start!";
    document.title = "hackmato";
    document.getElementsByClassName("timer")[0].style.backgroundColor = "#ff4747";
    timerInterval = null;
    numBreaks = 0;
}

function openSettings() {
    if (document.getElementsByClassName("invisible")[0].style.display == "block") {
        for (var i = 0; i < document.getElementsByClassName("invisible").length; i++) {
            document.getElementsByClassName("invisible")[i].style.display = "none";
        }
    } else {
        for (var i = 0; i < document.getElementsByClassName("invisible").length; i++) {
            document.getElementsByClassName("invisible")[i].style.display = "block";
        }
    }
}

function update() {
    pomodoro = parseInt(document.getElementById("work").value) * 60;
    shortBreak = parseInt(document.getElementById("break").value) * 60;
    longBreak = parseInt(document.getElementById("rest").value) * 60;
    breakAmount = parseInt(document.getElementById("breaks").value);
    reset();
}
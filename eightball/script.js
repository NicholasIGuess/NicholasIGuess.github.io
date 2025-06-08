const answers = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful",
];

function shake() {
    const input = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer");
    const ball = document.getElementById("ball");

    if (input === "") {
        answer.textContent = "Please ask a question.";
        return;
    }

    // ball.classList.remove("shake");
    // void ball.offsetWidth; //thank you copilot!
    // ball.classList.add("shake");

    answer.style.opacity = 0;


    const shakes = 4;
    const delay = 250;
    for (let i = 0; i < shakes; i++) {
        setTimeout(() => {
            var randX  = Math.floor(Math.random() * 51) - 25;
            var randY  = Math.floor(Math.random() * 51) - 25;
            var randR  = Math.floor(Math.random() * 41) - 20;

            ball.style.transform = `translate(${randX}px, ${randY}px) rotate(${randR}deg)`;
        }, i * delay);

        setTimeout(() => {
            ball.style.transition = "";
            ball.style.transform = "translate(0px, 0px) rotate(0deg)";
        }, i * delay + 200);
    }

    const response = answers[Math.floor(Math.random() * answers.length)];
    setTimeout(() => {
        answer.textContent = response;
        answer.style.opacity = 1;
    }, shakes * delay + 300);
}

document.getElementById("button").addEventListener("click", shake);
document.getElementById("question").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        shake();
    }
});

particlesJS.load('scene', 'particles.json', function() {
    console.log('callback - particles.js config loaded');
});
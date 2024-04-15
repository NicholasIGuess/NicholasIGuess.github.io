async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

async function loadHome() {
    const main = document.getElementById("main");
    main.innerHTML = await fetchHtmlAsText("https://raw.githubusercontent.com/NicholasIGuess/MakeSPP/main/index.html");
}

document.addEventListener("DOMContentLoaded", loadHome());

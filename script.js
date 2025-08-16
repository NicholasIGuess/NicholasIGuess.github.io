function createWave(side) {
    const waveDiv = document.querySelector('.css-wave-' + side);
    if (!waveDiv) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '320');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 320 1600');
    svg.style.height = '180vh';
    svg.style.width = '320px';
    svg.style.position = 'absolute';
    svg.style.top = '-20vh';
    svg.style.left = '0';
    svg.style.right = '0';
    svg.style.bottom = '0';
    svg.style.display = 'block';
    svg.style.zIndex = '0';
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('fill', side === 'left' ? '#d946ef' : '#a21caf');
    path.setAttribute('opacity', '0.18');
    svg.appendChild(path);
    waveDiv.appendChild(svg);
    function animateWave() {
        const t = Date.now() * 0.001;
        let d = `M0 0 `;
        for (let y = -200; y <= 1600; y += 10) {
            const baseAmp = 80 + 44 * Math.sin(t + y * 0.008 + (side === 'left' ? 0 : Math.PI));
            const freq = 0.012 + (side === 'left' ? 0.002 : -0.002);
            const extra = 18 * Math.sin(t * 1.7 + y * 0.018 + (side === 'left' ? 1.2 : 2.1));
            const extra2 = 10 * Math.cos(t * 2.3 + y * 0.025 + (side === 'left' ? 0.7 : 1.5));
            const x = 160 + Math.sin(t * 0.7 + y * freq) * baseAmp + extra + extra2;
            d += `L${x.toFixed(2)} ${y} `;
        }
        d += 'L320 1600 L0 1600 Z';
        path.setAttribute('d', d);
        requestAnimationFrame(animateWave);
    }
    animateWave();
}
createWave('left');
createWave('right');

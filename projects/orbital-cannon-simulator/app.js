// Orbital Cannon Simulator
// Simulates launching objects into orbit and visualizes trajectory

const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');
const infoDiv = document.getElementById('info');
const form = document.getElementById('launch-form');

const G = 6.67430e-11; // Gravitational constant
const earthMass = 5.972e24; // kg
const earthRadius = 6371000; // meters
const scale = 1e-6; // For drawing

function drawEarth() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, earthRadius*scale, 0, 2*Math.PI);
    ctx.fillStyle = '#1976d2';
    ctx.fill();
    ctx.restore();
}

drawEarth();

function simulateLaunch(mass, velocity, angle) {
    drawEarth();
    // Initial position: surface of earth
    let x = canvas.width/2;
    let y = canvas.height/2 - earthRadius*scale;
    let rad = angle * Math.PI / 180;
    let vx = velocity * Math.cos(rad);
    let vy = velocity * Math.sin(rad);
    let dt = 0.1; // seconds
    let path = [];
    let t = 0;
    let r = earthRadius;
    let crashed = false;
    while (t < 300 && r > earthRadius) {
        // Gravity
        let g = G * earthMass / (r * r);
        vy += g * dt;
        x += vx * dt * scale;
        y -= vy * dt * scale;
        r = Math.sqrt(Math.pow((x-canvas.width/2)/scale,2) + Math.pow((y-canvas.height/2)/scale,2));
        path.push({x, y});
        if (r < earthRadius) {
            crashed = true;
            break;
        }
        t += dt;
    }
    // Draw path
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i=1; i<path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = crashed ? 'red' : 'green';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    return {path, crashed, finalR: r};
}

function escapeVelocity(mass) {
    return Math.sqrt(2 * G * earthMass / earthRadius);
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const mass = parseFloat(document.getElementById('mass').value);
    const velocity = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('angle').value);
    const escVel = escapeVelocity(mass);
    const result = simulateLaunch(mass, velocity, angle);
    infoDiv.innerHTML = `Escape Velocity: ${escVel.toFixed(2)} m/s<br>` +
        `Launch Velocity: ${velocity} m/s<br>` +
        `Angle: ${angle}°<br>` +
        (result.crashed ? '<b>Object crashed back to Earth!</b>' : '<b>Object reached orbit!</b>');
});

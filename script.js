// script.js
import { drawLattice } from './lattice.js';

export var points = []; // Store point data for interaction
let isTonnetzMode = false; // Tonnetz lattice mode

export function getSettings() {
    return {
        xAxisIntervalStr: document.getElementById('xAxisInterval').value,
        yAxisIntervalStr: document.getElementById('yAxisInterval').value,
        labelSize: parseInt(document.getElementById('labelSize').value),
        orientation: parseFloat(document.getElementById('orientation').value) * Math.PI / 180,
        pointSpacing: parseFloat(document.getElementById('pointSpacing').value) * window.zoomFactor,
        labelFormat: document.getElementById('labelFormat').value,
        emphasizeOne: document.getElementById('emphasizeOne').checked,
        findCommas: document.getElementById('findCommas').checked,
        showNonCommaIntervals: document.getElementById('showNonCommas').checked,
        minCents: parseFloat(document.getElementById('minCents').value),
        maxCents: parseFloat(document.getElementById('maxCents').value),
        isTonnetzMode: isTonnetzMode,
        showGridLines: document.getElementById('showGridLines').checked,
        xAxisColor: document.getElementById('xAxisColor').value,
        yAxisColor: document.getElementById('yAxisColor').value
    };
}

export function setTonnetzMode(value) {
    isTonnetzMode = value;
}

window.zoomFactor = 1; // Initialize zoom factor

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawLattice(getSettings());
}

window.addEventListener('resize', resizeCanvas);

document.getElementById('redraw').addEventListener('click', () => drawLattice(getSettings()));
document.getElementById('tonnetzToggle').addEventListener('change', function() {
    setTonnetzMode(this.checked);
    drawLattice(getSettings());
});

document.addEventListener("DOMContentLoaded", function() {
    resizeCanvas(); // Adjust the canvas size initially
    drawLattice(getSettings());  // Draw the lattice on page load
});

// Add wheel event listener for zooming
canvas.addEventListener('wheel', function(event) {
    event.preventDefault();
    if (event.deltaY < 0) {
        window.zoomFactor *= 1.1; // Zoom in
    } else {
        window.zoomFactor /= 1.1; // Zoom out
    }
    drawLattice(getSettings());
});

resizeCanvas();

document.getElementById('redraw').addEventListener('click', () => drawLattice(getSettings()));
document.getElementById('tonnetzToggle').addEventListener('change', function() {
    setTonnetzMode(this.checked);
    drawLattice(getSettings());
});

// Add event listeners for control options
const controls = [
    'xAxisInterval', 'yAxisInterval', 'labelSize', 'orientation', 'pointSpacing',
    'labelFormat', 'emphasizeOne', 'findCommas', 'minCents', 'maxCents', 'showNonCommas',
    'showGridLines', 'xAxisColor', 'yAxisColor'
];

controls.forEach(control => {
    document.getElementById(control).addEventListener('change', () => drawLattice(getSettings()));
});

document.getElementById('toggleControls').addEventListener('click', function() {
    var controls = document.getElementById('controls');
    if (controls.classList.contains('hidden')) {
        controls.classList.remove('hidden');
    } else {
        controls.classList.add('hidden');
    }
});
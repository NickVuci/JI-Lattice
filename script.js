// script.js
import { drawLattice } from './lattice.js';
import { parseFraction, ratioToCents } from './utils.js';

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
        includeInverseRange: document.getElementById('includeInverseRange').checked,
    };
}

export function setTonnetzMode(value) {
    isTonnetzMode = value;
}

window.zoomFactor = 1; // Initialize zoom factor

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawLattice(getSettings());
}

function toggleControls() {
    const controls = document.getElementById('controls');
    controls.classList.toggle('hidden');
}

function handleZoom(event) {
    event.preventDefault();
    window.zoomFactor *= event.deltaY < 0 ? 1.1 : 1 / 1.1;
    drawLattice(getSettings());
}

function initializeEventListeners() {
    document.getElementById('redraw').addEventListener('click', () => drawLattice(getSettings()));
    document.getElementById('tonnetzToggle').addEventListener('change', function() {
        setTonnetzMode(this.checked);
        drawLattice(getSettings());
    });

    const controls = [
        'xAxisInterval', 'yAxisInterval', 'labelSize', 'orientation', 'pointSpacing',
        'labelFormat', 'emphasizeOne', 'findCommas', 'minCents', 'maxCents', 'showNonCommas',
        'showGridLines', 'includeInverseRange',
    ];

    controls.forEach(control => {
        document.getElementById(control).addEventListener('change', () => drawLattice(getSettings()));
    });

    document.getElementById('toggleControls').addEventListener('click', toggleControls);
    canvas.addEventListener('wheel', handleZoom);
    window.addEventListener('resize', resizeCanvas);
}

document.addEventListener("DOMContentLoaded", function() {
    resizeCanvas(); // Adjust the canvas size initially
    drawLattice(getSettings());  // Draw the lattice on page load
    initializeEventListeners();
});
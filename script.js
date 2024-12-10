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
        isTonnetzMode: isTonnetzMode // Include isTonnetzMode in settings
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

function parseFraction(str) {
    var parts = str.split('/');
    if (parts.length === 2) {
        var numerator = parseFloat(parts[0]);
        var denominator = parseFloat(parts[1]);
        return numerator / denominator;
    } else {
        return parseFloat(str);
    }
}

function decimalToFraction(decimal, maxDenominator = 1000) {
    var bestNumerator = 1;
    var bestDenominator = 1;
    var bestError = Math.abs(decimal - (bestNumerator / bestDenominator));

    for (var denominator = 1; denominator <= maxDenominator; denominator++) {
        var numerator = Math.round(decimal * denominator);
        var approx = numerator / denominator;
        var error = Math.abs(decimal - approx);
        if (error < bestError) {
            bestError = error;
            bestNumerator = numerator;
            bestDenominator = denominator;
            if (error === 0) break;
        }
    }

    return bestNumerator + '/' + bestDenominator;
}

function ratioToCents(ratio) {
    return 1200 * Math.log2(ratio);
}

function getIntervalLabel(intervalDecimal, labelFormat) {
    if (labelFormat === 'fraction') {
        var fractionLabel = decimalToFraction(intervalDecimal);
        return fractionLabel;
    } else {
        return intervalDecimal.toFixed(4);
    }
}

function getHeatMapColor(value, min, max) {
    // Normalize value to range [0, 1]
    var t = (value - min) / (max - min);
    t = Math.max(0, Math.min(1, t));

    // Define red-yellow-green gradient based on t
    var r, g, b;
    if (t < 0.5) {
        // Gradient from red to yellow
        r = 255;
        g = Math.round(2 * t * 255);
        b = 0;
    } else {
        // Gradient from yellow to green
        r = Math.round((1 - 2 * (t - 0.5)) * 255);
        g = 255;
        b = 0;
    }
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

resizeCanvas();

document.getElementById('redraw').addEventListener('click', () => drawLattice(getSettings()));
document.getElementById('tonnetzToggle').addEventListener('change', function() {
    setTonnetzMode(this.checked);
    drawLattice(getSettings());
});

// Add event listeners for control options
const controls = [
    'xAxisInterval', 'yAxisInterval', 'labelSize', 'orientation', 'pointSpacing',
    'labelFormat', 'emphasizeOne', 'findCommas', 'minCents', 'maxCents', 'showNonCommas'
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
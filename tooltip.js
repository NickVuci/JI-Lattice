import { points } from './lattice.js';
import { decimalToFraction, ratioToCents } from './utils.js';

var tooltip = document.getElementById('tooltip');
var canvas = document.getElementById('canvas');

// Function to show tooltip for a point
function showTooltip(point, event) {
    const fractionLabel = decimalToFraction(point.intervalDecimal);
    const centsLabel = ratioToCents(point.intervalDecimal).toFixed(2) + '¢';
    tooltip.style.left = (event.clientX + 15) + 'px';
    tooltip.style.top = (event.clientY + 15) + 'px';
    tooltip.innerHTML = `Interval: ${fractionLabel}<br>Cents: ${centsLabel}`;
    tooltip.style.display = 'block';
}

// Function to hide tooltip
function hideTooltip() {
    tooltip.style.display = 'none';
}

// Add event listeners to canvas for tooltip functionality
canvas.addEventListener('mousemove', function(event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    var found = false;

    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var dx = (mouseX - point.x) / window.zoomFactor;
        var dy = (mouseY - point.y) / window.zoomFactor;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= point.radius + 2) {
            showTooltip(point, event);
            found = true;
            break;
        }
    }

    if (!found) {
        hideTooltip();
    }
});

canvas.addEventListener('mouseout', hideTooltip);
var tooltip = document.getElementById('tooltip');

// Function to show tooltip for a point
function showTooltip(point, event) {
    tooltip.style.left = (point.x + 15) + 'px';
    tooltip.style.top = (point.y + 15) + 'px';
    tooltip.innerHTML = 'Interval: ' + point.label + '<br>Cents: ' + point.cents;
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
        var dx = mouseX - point.x;
        var dy = mouseY - point.y;
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

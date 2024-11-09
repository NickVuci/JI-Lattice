var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var tooltip = document.getElementById('tooltip');
var points = []; // Store point data for interaction
let isTonnetzMode = false; // Tonnetz lattice mode

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawLattice();
}

window.addEventListener('resize', resizeCanvas);

document.getElementById('redraw').addEventListener('click', drawLattice);

document.getElementById('tonnetzToggle').addEventListener('change', function() {
    isTonnetzMode = this.checked;
    drawLattice(); // Redraw the lattice when toggled
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

function drawLattice() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = []; // Reset points array

    var xAxisIntervalStr = document.getElementById('xAxisInterval').value;
    var yAxisIntervalStr = document.getElementById('yAxisInterval').value;
    var labelSize = parseInt(document.getElementById('labelSize').value);
    var orientation = parseFloat(document.getElementById('orientation').value) * Math.PI / 180;
    var pointSpacing = parseFloat(document.getElementById('pointSpacing').value) * window.zoomFactor; // Reference zoomFactor here
    var labelFormat = document.getElementById('labelFormat').value;
    var emphasizeOne = document.getElementById('emphasizeOne').checked;
    var findCommas = document.getElementById('findCommas').checked;
    var showNonCommas = document.getElementById('showNonCommas').checked;
    var minCents = parseFloat(document.getElementById('minCents').value);
    var maxCents = parseFloat(document.getElementById('maxCents').value);

    var xAxisInterval = parseFraction(xAxisIntervalStr);
    var yAxisInterval = parseFraction(yAxisIntervalStr);

    if (isNaN(xAxisInterval) || isNaN(yAxisInterval)) {
        alert('Please enter valid intervals.');
        return;
    }

    var maxDistance = Math.sqrt((canvas.width / 2) * (canvas.width / 2) + (canvas.height / 2) * (canvas.height / 2));
    var N = Math.ceil(maxDistance / pointSpacing) + 1;

    for (var i = -N; i <= N; i++) {
        for (var j = -N; j <= N; j++) {
            // Determine position based on Tonnetz mode
            var x, y;
            if (isTonnetzMode) {
                // Tonnetz triangular grid arrangement
                x = (i + j / 2) * pointSpacing;
                y = (j * Math.sqrt(3) / 2) * pointSpacing;
            } else {
                // Standard square grid
                x = i * pointSpacing;
                y = j * pointSpacing;
            }

            // Apply rotation
            var xRot = x * Math.cos(orientation) - y * Math.sin(orientation);
            var yRot = x * Math.sin(orientation) + y * Math.cos(orientation);

            // Translate to canvas center
            var canvasX = xRot + canvas.width / 2;
            var canvasY = yRot + canvas.height / 2;

            if (canvasX < -50 || canvasX > canvas.width + 50 || canvasY < -50 || canvasY > canvas.height + 50) {
                continue;
            }

            var intervalDecimal = Math.pow(xAxisInterval, i) * Math.pow(yAxisInterval, j);
            while (intervalDecimal < 1) {
                intervalDecimal *= 2;
            }
            while (intervalDecimal >= 2) {
                intervalDecimal /= 2;
            }

            var centsDifference = Math.abs(ratioToCents(intervalDecimal));
            var isOne = Math.abs(intervalDecimal - 1) < 0.0001;

            var emphasizePoint = false;
            var pointColor = '#000';

            if (emphasizeOne && isOne) {
                emphasizePoint = true;
                pointColor = '#FF0000'; // Red color for 1/1
            }

            if (findCommas && !isOne) {
                if (centsDifference >= minCents && centsDifference <= maxCents) {
                    emphasizePoint = true;
                    pointColor = getHeatMapColor(centsDifference, minCents, maxCents); // Set color based on heat map
                } else if (!showNonCommas) {
                    continue; // Skip points outside the comma range if showNonCommas is false
                }
            }

            points.push({
                x: canvasX,
                y: canvasY,
                radius: emphasizePoint ? 10 : 5,
                label: getIntervalLabel(intervalDecimal, labelFormat),
                cents: centsDifference.toFixed(2),
                color: pointColor
            });

            ctx.beginPath();
            ctx.fillStyle = pointColor;
            ctx.arc(canvasX, canvasY, emphasizePoint ? 10 : 5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.font = labelSize + "px Arial";
            ctx.textAlign = "center";
            ctx.fillText(getIntervalLabel(intervalDecimal, labelFormat), canvasX, canvasY - 10);
        }
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
            tooltip.style.left = (point.x + 15) + 'px';
            tooltip.style.top = (point.y + 15) + 'px';
            tooltip.innerHTML = 'Interval: ' + point.label + '<br>Cents: ' + point.cents;
            tooltip.style.display = 'block';
            found = true;
            break;
        }
    }

    if (!found) {
        tooltip.style.display = 'none';
    }
});

canvas.addEventListener('mouseout', function() {
    tooltip.style.display = 'none';
});

resizeCanvas();

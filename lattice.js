// lattice.js
import { getSettings } from './script.js';

export let points = []; // Export points array

export function drawLattice(settings) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');
    points = []; // Reset points array
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const {
        xAxisIntervalStr, yAxisIntervalStr, labelSize, orientation,
        pointSpacing, labelFormat, emphasizeOne, findCommas, 
        showNonCommaIntervals, minCents, maxCents, isTonnetzMode
    } = settings;

    const xAxisInterval = parseFraction(xAxisIntervalStr);
    const yAxisInterval = parseFraction(yAxisIntervalStr);

    if (isNaN(xAxisInterval) || isNaN(yAxisInterval)) {
        alert('Please enter valid intervals.');
        return;
    }

    const maxDistance = Math.sqrt((canvas.width / 2) ** 2 + (canvas.height / 2) ** 2);
    const N = Math.ceil(maxDistance / pointSpacing) + 1;

    for (let i = -N; i <= N; i++) {
        for (let j = -N; j <= N; j++) {
            // Determine position based on Tonnetz mode
            let x, y;
            if (isTonnetzMode) {
                // Tonnetz triangular grid arrangement
                x = (i + j / 2 ) * pointSpacing;
                y = (j * Math.sqrt(3) / 2) * pointSpacing;
            } else {
                // Standard square grid
                x = i * pointSpacing;
                y = j * pointSpacing;
            }

            // Apply orientation rotation
            const xRot = x * Math.cos(orientation) - y * Math.sin(orientation);
            const yRot = x * Math.sin(orientation) + y * Math.cos(orientation);

            const canvasX = xRot + canvas.width / 2;
            const canvasY = yRot + canvas.height / 2;

            if (
                canvasX < -50 ||
                canvasX > canvas.width + 50 ||
                canvasY < -50 ||
                canvasY > canvas.height + 50
            ) {
                continue;
            }

            // Calculate interval
            let intervalDecimal;
            if (isTonnetzMode) {
                intervalDecimal = Math.pow(xAxisInterval, i) * Math.pow(yAxisInterval, j);
            } else {
                intervalDecimal = Math.pow(xAxisInterval, i) * Math.pow(yAxisInterval, j);
            }

            // Normalize interval to within one octave
            while (intervalDecimal < 1) intervalDecimal *= 2;
            while (intervalDecimal >= 2) intervalDecimal /= 2;

            const centsDifference = Math.abs(ratioToCents(intervalDecimal));
            const isOne = Math.abs(intervalDecimal - 1) < 0.0001;

            let emphasizePoint = false;
            let pointColor = '#000';

            if (emphasizeOne && isOne) {
                emphasizePoint = true;
                pointColor = '#FF0000';
            }

            if (findCommas && !isOne) {
                if (centsDifference >= minCents && centsDifference <= maxCents) {
                    emphasizePoint = true;
                    const t = (centsDifference - minCents) / (maxCents - minCents);
                    pointColor = getColorGradient(Math.min(Math.max(t, 0), 1));
                } else if (!showNonCommaIntervals) {
                    continue; // Skip points outside the comma range if toggled off
                }
            }

            points.push({
                x: canvasX,
                y: canvasY,
                radius: emphasizePoint ? 10 : 5,
                label: getIntervalLabel(intervalDecimal, labelFormat),
                cents: centsDifference.toFixed(2),
                color: pointColor,
            });

            ctx.beginPath();
            ctx.fillStyle = pointColor;
            ctx.arc(canvasX, canvasY, emphasizePoint ? 10 : 5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.font = `${labelSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(
                getIntervalLabel(intervalDecimal, labelFormat),
                canvasX,
                canvasY - 10
            );
        }
    }   
}

// Utility functions
function parseFraction(str) {
    const parts = str.split('/');
    return parts.length === 2
        ? parseFloat(parts[0]) / parseFloat(parts[1])
        : parseFloat(str);
}

function ratioToCents(ratio) {
    return 1200 * Math.log2(ratio);
}

function getIntervalLabel(intervalDecimal, labelFormat) {
    return labelFormat === 'fraction'
        ? decimalToFraction(intervalDecimal)
        : intervalDecimal.toFixed(4);
}

function decimalToFraction(decimal, maxDenominator = 1000) {
    let bestNumerator = 1;
    let bestDenominator = 1;
    let bestError = Math.abs(decimal - bestNumerator / bestDenominator);

    for (let denominator = 1; denominator <= maxDenominator; denominator++) {
        const numerator = Math.round(decimal * denominator);
        const approx = numerator / denominator;
        const error = Math.abs(decimal - approx);
        if (error < bestError) {
            bestError = error;
            bestNumerator = numerator;
            bestDenominator = denominator;
            if (error === 0) break;
        }
    }

    return `${bestNumerator}/${bestDenominator}`;
}

function getColorGradient(t) {
    const r = 255;
    const g = Math.round((1 - t) * 255);
    const b = Math.round(t * 255);
    return `rgb(${r},${g},${b})`;
}
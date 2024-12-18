import { parseFraction, ratioToCents, getIntervalLabel, normalizeInterval, getColorGradient } from './utils.js';

export let points = []; // Export points array

export function drawLattice(settings) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    points = []; // Reset points array

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const {
        xAxisIntervalStr, yAxisIntervalStr, labelSize, orientation,
        pointSpacing, labelFormat, emphasizeOne, findCommas, 
        showNonCommaIntervals, minCents, maxCents, isTonnetzMode,
        showGridLines, includeInverseRange,
    } = settings;

    const xAxisInterval = parseInterval(xAxisIntervalStr);
    const yAxisInterval = parseInterval(yAxisIntervalStr);

    if (isNaN(xAxisInterval) || isNaN(yAxisInterval)) {
        alert('Please enter valid intervals.');
        return;
    }

    const maxDistance = Math.sqrt((canvas.width / 2) ** 2 + (canvas.height / 2) ** 2);
    const N = Math.ceil(maxDistance / pointSpacing) + 1;

    if (showGridLines) {
        if (isTonnetzMode) {
            ctx.strokeStyle = '#000000';
            // Draw Tonnetz grid lines
            for (let i = -N; i <= N; i++) {
                for (let j = -N; j <= N; j++) {
                    const x = (i + j / 2) * pointSpacing;
                    const y = (j * Math.sqrt(3) / 2) * pointSpacing;

                    // Apply orientation rotation
                    const xRot = x * Math.cos(orientation) - y * Math.sin(orientation);
                    const yRot = x * Math.sin(orientation) + y * Math.cos(orientation);

                    // Neighbors in the Tonnetz grid
                    const neighbors = [
                        [i + 1, j],         // Right neighbor
                        [i, j + 1],         // Up neighbor
                        [i - 1, j + 1],     // Up-left neighbor
                    ];

                    for (const [ni, nj] of neighbors) {
                        const nx = (ni + nj / 2) * pointSpacing;
                        const ny = (nj * Math.sqrt(3) / 2) * pointSpacing;

                        // Apply orientation rotation to neighbors
                        const nxRot = nx * Math.cos(orientation) - ny * Math.sin(orientation);
                        const nyRot = nx * Math.sin(orientation) + ny * Math.cos(orientation);

                        ctx.beginPath();
                        ctx.moveTo(xRot + canvas.width / 2, yRot + canvas.height / 2);
                        ctx.lineTo(nxRot + canvas.width / 2, nyRot + canvas.height / 2);
                        ctx.stroke();
                    }
                }
            }
        } else {
            // Draw grid lines for each row and column
            for (let i = -N; i <= N; i++) {
                const x = i * pointSpacing;
                const xRotStart = x * Math.cos(orientation) - (-canvas.height) * Math.sin(orientation);
                const yRotStart = x * Math.sin(orientation) + (-canvas.height) * Math.cos(orientation);
                const xRotEnd = x * Math.cos(orientation) - (canvas.height) * Math.sin(orientation);
                const yRotEnd = x * Math.sin(orientation) + (canvas.height) * Math.cos(orientation);
    
                ctx.beginPath();
                ctx.moveTo(xRotStart + canvas.width / 2, yRotStart + canvas.height / 2);
                ctx.lineTo(xRotEnd + canvas.width / 2, yRotEnd + canvas.height / 2);
                ctx.stroke();
            }
    
            for (let j = -N; j <= N; j++) {
                const y = j * pointSpacing;
                const xRotStart = (-canvas.width) * Math.cos(orientation) - y * Math.sin(orientation);
                const yRotStart = (-canvas.width) * Math.sin(orientation) + y * Math.cos(orientation);
                const xRotEnd = (canvas.width) * Math.cos(orientation) - y * Math.sin(orientation);
                const yRotEnd = (canvas.width) * Math.sin(orientation) + y * Math.cos(orientation);
    
                ctx.beginPath();
                ctx.moveTo(xRotStart + canvas.width / 2, yRotStart + canvas.height / 2);
                ctx.lineTo(xRotEnd + canvas.width / 2, yRotEnd + canvas.height / 2);
                ctx.stroke();
            }
        }
    }

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
            let intervalDecimal = Math.pow(xAxisInterval, i) * Math.pow(yAxisInterval, j);
            intervalDecimal = normalizeInterval(intervalDecimal); // Normalize interval

            // Correct for floating-point precision issues
            const epsilon = 1e-10;
            if (Math.abs(intervalDecimal - 1) < epsilon) {
                intervalDecimal = 1;
            }

            const centsDifference = Math.abs(ratioToCents(intervalDecimal));
            const inverseCentsDifference = 1200 - centsDifference;
            const isOne = Math.abs(intervalDecimal - 1) < 0.0001;

            let emphasizePoint = false;
            let pointColor = '#000';

            if (emphasizeOne && isOne) {
                emphasizePoint = true;
                pointColor = '#FF0000';
            }

            if (findCommas && !isOne) {
                if ((centsDifference >= minCents && centsDifference <= maxCents) ||
                    (includeInverseRange && inverseCentsDifference >= minCents && inverseCentsDifference <= maxCents)) {
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
                intervalDecimal: intervalDecimal // Add this line to store intervalDecimal
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

function parseInterval(intervalStr) {
    if (intervalStr.endsWith('c')) {
        const cents = parseFloat(intervalStr.slice(0, -1));
        return Math.pow(2, cents / 1200);
    } else if (intervalStr.includes('/')) {
        return parseFraction(intervalStr);
    } else {
        return parseFloat(intervalStr);
    }
}


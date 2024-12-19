// utils.js

export function parseFraction(str) {
    const parts = str.split('/');
    return parts.length === 2
        ? parseFloat(parts[0]) / parseFloat(parts[1])
        : parseFloat(str);
}

export function ratioToCents(ratio) {
    return 1200 * Math.log2(ratio);
}

export function normalizeInterval(interval) {
    // Adjust exponent with Math.round to handle floating-point errors
    while (interval >= 2) {
        interval /= 2;
    }
    while (interval < 1) {
        interval *= 2;
    }
    // Ensure 2.000 is rendered as 1.0000
    if (Math.abs(interval - 1) < 1e-10) {
        interval = 1;
    }
    return interval;
}

export function getIntervalLabel(intervalDecimal, labelFormat) {
    if (labelFormat === 'fraction') {
        return decimalToFraction(intervalDecimal);
    } else if (labelFormat === 'decimal') {
        return intervalDecimal.toFixed(4);
    } else if (labelFormat === 'cents') {
        let cents = ratioToCents(intervalDecimal);
        cents = ((cents % 1200) + 1200) % 1200; // Ensure cents is between 0 and 1200
        // Ensure 1200c is rendered as 0c
        if (Math.abs(cents) < 1e-10) {
            cents = 0;
        }
        return cents.toFixed(2) + 'c';
    }
}

export function decimalToFraction(decimal, maxDenominator = 1000000) {
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

export function getColorGradient(t) {
    const r = 255;
    const g = Math.round((1 - t) * 255);
    const b = Math.round(t * 255);
    return `rgb(${r},${g},${b})`;
}
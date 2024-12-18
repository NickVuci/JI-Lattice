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
    return interval * Math.pow(2, -Math.round(Math.log2(interval)));
}

export function getIntervalLabel(intervalDecimal, labelFormat) {
    if (labelFormat === 'fraction') {
        return decimalToFraction(intervalDecimal);
    } else if (labelFormat === 'decimal') {
        return intervalDecimal.toFixed(4);
    } else if (labelFormat === 'cents') {
        let cents = ratioToCents(intervalDecimal);
        cents = ((cents % 1200) + 1200) % 1200; // Ensure cents is between 0 and 1200
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
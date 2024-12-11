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

export function getIntervalLabel(intervalDecimal, labelFormat) {
    return labelFormat === 'fraction'
        ? decimalToFraction(intervalDecimal)
        : intervalDecimal.toFixed(4);
}

export function decimalToFraction(decimal, maxDenominator = 1000) {
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
export function calculateSMA(data: number[], period: number): number[] {
    const sma = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            sma.push(NaN); // Not enough data
            continue;
        }

        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j];
        }
        sma.push(sum / period);
    }
    return sma;
}

export function calculateEMA(data: number[], period: number): number[] {
    const k = 2 / (period + 1);
    const ema: number[] = [];

    // Start with SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += data[i];
    }
    const initialSMA = sum / period;

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            ema.push(NaN);
            continue;
        }
        if (i === period - 1) {
            ema.push(initialSMA);
            continue;
        }

        const prevEMA = ema[i - 1];
        const currentEMA = (data[i] * k) + (prevEMA * (1 - k));
        ema.push(currentEMA);
    }
    return ema;
}

const FRED_API_URL = 'https://api.stlouisfed.org/fred/series/observations';
const API_KEY = process.env.FRED_API_KEY;

export interface FredDataPoint {
    date: string;
    value: number;
}

export async function getFredSeries(seriesId: string): Promise<FredDataPoint[]> {
    if (!API_KEY) {
        console.warn('FRED_API_KEY is not set. Returning mock data.');
        return getMockFredData(seriesId);
    }

    try {
        const response = await fetch(
            `${FRED_API_URL}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=20`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch FRED data: ${response.statusText}`);
        }

        const data = await response.json();
        return data.observations.map((obs: any) => ({
            date: obs.date,
            value: parseFloat(obs.value),
        }));
    } catch (error) {
        console.error(`Error fetching FRED series ${seriesId}:`, error);
        return getMockFredData(seriesId);
    }
}

function getMockFredData(seriesId: string): FredDataPoint[] {
    const today = new Date();
    const data: FredDataPoint[] = [];

    for (let i = 0; i < 12; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);

        let value = 0;
        if (seriesId === 'M2SL') { // M2 Money Stock
            value = 20800 + Math.random() * 500 - i * 50; // Roughly 20.8T
        } else if (seriesId === 'SOFR') { // Repo Rate
            value = 5.3 + Math.random() * 0.1; // Roughly 5.3%
        }

        data.push({
            date: date.toISOString().split('T')[0],
            value: parseFloat(value.toFixed(2)),
        });
    }

    return data;
}

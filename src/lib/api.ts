export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
}

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function getSpotPrices(ids: string[] = ['bitcoin', 'ethereum']): Promise<CoinData[]> {
    try {
        const response = await fetch(
            `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
            {
                next: { revalidate: 60 }, // Cache for 60 seconds
                headers: {
                    'Accept': 'application/json',
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching spot prices:', error);
        // Return mock data if API fails (likely due to rate limits on free tier)
        return [
            {
                id: 'bitcoin',
                symbol: 'btc',
                name: 'Bitcoin',
                current_price: 95000,
                price_change_percentage_24h: 2.5,
                market_cap: 1800000000000,
                total_volume: 50000000000,
            },
            {
                id: 'ethereum',
                symbol: 'eth',
                name: 'Ethereum',
                current_price: 3500,
                price_change_percentage_24h: 1.2,
                market_cap: 400000000000,
                total_volume: 20000000000,
            },
        ];
    }
}

export async function getHistoricalData(id: string, days: number = 30): Promise<{ date: string; value: number }[]> {
    try {
        const response = await fetch(
            `${COINGECKO_API_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
            {
                next: { revalidate: 3600 },
                headers: { 'Accept': 'application/json' }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch history: ${response.statusText}`);
        }

        const data = await response.json();
        return data.prices.map((item: [number, number]) => ({
            date: new Date(item[0]).toISOString(),
            value: item[1],
        }));
    } catch (error) {
        console.error('Error fetching historical data:', error);
        // Mock data
        const data = [];
        const today = new Date();
        for (let i = days; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            data.push({
                date: date.toISOString(),
                value: 90000 + Math.random() * 10000,
            });
        }
        return data;
    }
}

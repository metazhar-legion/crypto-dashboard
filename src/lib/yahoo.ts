import yahooFinance from 'yahoo-finance2';

export interface MarketData {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    shortName: string;
}

export async function getMarketData(symbols: string[] = ['GC=F', '^GSPC']): Promise<MarketData[]> {
    try {
        const results = await Promise.all(
            symbols.map(async (symbol) => {
                try {
                    const quote = await yahooFinance.quote(symbol) as any;
                    return {
                        symbol: quote.symbol,
                        regularMarketPrice: quote.regularMarketPrice || 0,
                        regularMarketChangePercent: quote.regularMarketChangePercent || 0,
                        shortName: quote.shortName || symbol,
                    };
                } catch (err) {
                    console.error(`Error fetching ${symbol}:`, err);
                    return null;
                }
            })
        );

        return results.filter((item): item is MarketData => item !== null);
    } catch (error) {
        console.error('Error fetching market data:', error);
        // Return mock data if API fails
        return [
            {
                symbol: 'GC=F',
                regularMarketPrice: 2650.50,
                regularMarketChangePercent: 0.5,
                shortName: 'Gold Futures',
            },
            {
                symbol: '^GSPC',
                regularMarketPrice: 5900.00,
                regularMarketChangePercent: 0.2,
                shortName: 'S&P 500',
            },
        ];
    }
}

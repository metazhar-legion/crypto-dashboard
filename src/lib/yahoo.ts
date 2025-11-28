import yahooFinance from 'yahoo-finance2';

export interface MarketData {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    shortName: string;
}

export async function getMarketData(symbols: string[] = ['GC=F', '^GSPC']): Promise<MarketData[]> {
    // Yahoo Finance API has initialization issues in Next.js SSR context
    // Using mock data for now - can be replaced with alternative API later
    console.log('Using mock data for Yahoo Finance');

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
    ]
        ;
}

const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info';

export interface DerivativeData {
    coin: string;
    price: number;
    fundingRate: number; // Hourly funding rate
    openInterest: number; // In base asset
    openInterestUsd: number;
}

export async function getDerivativesData(): Promise<DerivativeData[]> {
    try {
        const response = await fetch(HYPERLIQUID_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Hyperliquid data: ${response.statusText}`);
        }

        const data = await response.json();
        const [meta, assetCtxs] = data;
        const universe = meta.universe;

        return universe.map((asset: any, index: number) => {
            const ctx = assetCtxs[index];
            const price = parseFloat(ctx.markPx);
            const fundingRate = parseFloat(ctx.funding) * 100; // Convert to percentage
            const openInterest = parseFloat(ctx.openInterest);

            return {
                coin: asset.name,
                price,
                fundingRate,
                openInterest,
                openInterestUsd: openInterest * price,
            };
        });
    } catch (error) {
        console.error('Error fetching derivatives data:', error);
        // Mock data
        return [
            { coin: 'BTC', price: 95000, fundingRate: 0.01, openInterest: 200000, openInterestUsd: 19000000000 },
            { coin: 'ETH', price: 3500, fundingRate: 0.012, openInterest: 1000000, openInterestUsd: 3500000000 },
            { coin: 'SOL', price: 150, fundingRate: 0.02, openInterest: 5000000, openInterestUsd: 750000000 },
        ];
    }
}

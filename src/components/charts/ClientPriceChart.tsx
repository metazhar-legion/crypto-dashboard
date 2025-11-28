'use client';

import dynamic from 'next/dynamic';

const PriceChart = dynamic(() => import('@/components/charts/PriceChart').then(mod => mod.PriceChart), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">Loading Chart...</div>
});

export default PriceChart;

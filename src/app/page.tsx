import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSpotPrices, getHistoricalData } from '@/lib/api';
import { getFredSeries } from '@/lib/fred';
import { getMarketData } from '@/lib/yahoo';
import { calculateSMA, calculateEMA } from '@/lib/indicators';
import dynamic from 'next/dynamic';

const PriceChart = dynamic(() => import('@/components/charts/PriceChart').then(mod => mod.PriceChart), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">Loading Chart...</div>
});

export default async function Home() {
  const pricesPromise = getSpotPrices(['bitcoin', 'ethereum']);
  const m2Promise = getFredSeries('M2SL');
  const sofrPromise = getFredSeries('SOFR');
  const marketPromise = getMarketData(['GC=F', '^GSPC']);
  const historyPromise = getHistoricalData('bitcoin', 30);

  const [prices, m2Data, sofrData, marketData, btcHistory] = await Promise.all([
    pricesPromise,
    m2Promise,
    sofrPromise,
    marketPromise,
    historyPromise
  ]);

  const btc = prices.find((p) => p.id === 'bitcoin');
  const eth = prices.find((p) => p.id === 'ethereum');

  const currentM2 = m2Data[0];
  const prevM2 = m2Data[1];
  const m2Change = prevM2 ? ((currentM2.value - prevM2.value) / prevM2.value) * 100 : 0;

  const currentSofr = sofrData[0];

  const gold = marketData.find((m) => m.symbol === 'GC=F');
  const spx = marketData.find((m) => m.symbol === '^GSPC');

  // Calculate Indicators
  const pricesOnly = btcHistory.map(d => d.value);
  const sma = calculateSMA(pricesOnly, 7);
  const ema = calculateEMA(pricesOnly, 7);

  const chartData = btcHistory.map((d, i) => ({
    ...d,
    sma: sma[i],
    ema: ema[i],
  }));

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatPercent = (value: number) =>
    `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{btc ? formatCurrency(btc.current_price) : 'Loading...'}</div>
            <p className={`text-xs ${btc && btc.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {btc ? formatPercent(btc.price_change_percentage_24h) : '0%'} from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ETH Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eth ? formatCurrency(eth.current_price) : 'Loading...'}</div>
            <p className={`text-xs ${eth && eth.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {eth ? formatPercent(eth.price_change_percentage_24h) : '0%'} from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Liquidity (M2)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentM2 ? (currentM2.value / 1000).toFixed(1) : '0'}T</div>
            <p className={`text-xs ${m2Change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercent(m2Change)} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">US Repo Rate (SOFR)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSofr ? currentSofr.value.toFixed(2) : '0'}%</div>
            <p className="text-xs text-muted-foreground">Overnight Financing Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gold Futures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gold ? formatCurrency(gold.regularMarketPrice) : 'Loading...'}</div>
            <p className={`text-xs ${gold && gold.regularMarketChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {gold ? formatPercent(gold.regularMarketChangePercent) : '0%'} from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">S&P 500</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spx ? formatCurrency(spx.regularMarketPrice) : 'Loading...'}</div>
            <p className={`text-xs ${spx && spx.regularMarketChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {spx ? formatPercent(spx.regularMarketChangePercent) : '0%'} from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PriceChart
          title="BTC Price History (30 Days)"
          data={chartData}
          showSMA={true}
          showEMA={true}
        />

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Funding Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Binance</p>
                  <p className="text-sm text-muted-foreground">BTC/USDT</p>
                </div>
                <div className="ml-auto font-medium text-green-500">+0.0100%</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Bybit</p>
                  <p className="text-sm text-muted-foreground">BTC/USDT</p>
                </div>
                <div className="ml-auto font-medium text-green-500">+0.0098%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDerivativesData } from '@/lib/hyperliquid';

export default async function DerivativesPage() {
    const derivativesData = await getDerivativesData();

    // Sort by Open Interest USD descending
    const sortedData = [...derivativesData].sort((a, b) => b.openInterestUsd - a.openInterestUsd);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

    const formatPercent = (value: number) =>
        `${value > 0 ? '+' : ''}${value.toFixed(4)}%`;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Derivatives Analytics</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Open Interest</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(sortedData.reduce((acc, curr) => acc + curr.openInterestUsd, 0))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Funding Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {formatPercent(Math.max(...sortedData.map(d => d.fundingRate)))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Market Overview (Hyperliquid)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Funding Rate (1h)</TableHead>
                                <TableHead>Open Interest (USD)</TableHead>
                                <TableHead>Open Interest (Coin)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedData.map((item) => (
                                <TableRow key={item.coin}>
                                    <TableCell className="font-medium">{item.coin}</TableCell>
                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                    <TableCell className={item.fundingRate > 0 ? 'text-green-500' : 'text-red-500'}>
                                        {formatPercent(item.fundingRate)}
                                    </TableCell>
                                    <TableCell>{formatCurrency(item.openInterestUsd)}</TableCell>
                                    <TableCell>{item.openInterest.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

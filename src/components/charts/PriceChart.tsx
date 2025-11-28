'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
    date: string;
    value: number;
    sma?: number;
    ema?: number;
}

interface PriceChartProps {
    title: string;
    data: DataPoint[];
    color?: string;
    valuePrefix?: string;
    valueSuffix?: string;
    showSMA?: boolean;
    showEMA?: boolean;
}

export function PriceChart({
    title,
    data,
    color = '#2563eb',
    valuePrefix = '$',
    valueSuffix = '',
    showSMA = false,
    showEMA = false
}: PriceChartProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', timeZone: 'UTC' });
                                }}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${valuePrefix}${value}${valueSuffix}`}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-1 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            {label ? new Date(label).toLocaleDateString('en-US', { timeZone: 'UTC' }) : ''}
                                                        </span>
                                                        {payload.map((entry: any) => (
                                                            <span key={entry.name} className="font-bold text-sm" style={{ color: entry.color }}>
                                                                {entry.name}: {valuePrefix}{entry.value.toFixed(2)}{valueSuffix}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Line
                                name="Price"
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2}
                                dot={false}
                            />
                            {showSMA && (
                                <Line
                                    name="SMA (7)"
                                    type="monotone"
                                    dataKey="sma"
                                    stroke="#ff9800"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            )}
                            {showEMA && (
                                <Line
                                    name="EMA (7)"
                                    type="monotone"
                                    dataKey="ema"
                                    stroke="#9c27b0"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

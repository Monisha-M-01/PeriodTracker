import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPredictionsFn } from '../../api/cycles.api';
import { getPeriodsFn } from '../../api/period.api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, differenceInDays } from 'date-fns';
import type { PeriodLog } from '../../types';

export default function HistoryPage() {
  const { data: predData, isLoading: isLoadingPreds } = useQuery({ queryKey: ['predictions'], queryFn: getPredictionsFn });
  const { data: periodData, isLoading: isLoadingPeriods } = useQuery({ queryKey: ['periods'], queryFn: getPeriodsFn });

  if (isLoadingPreds || isLoadingPeriods) {
    return <div className="flex justify-center h-64 items-center"><Spinner /></div>;
  }

  const history = predData?.data?.history;
  const periods = periodData?.data || [];

  // Prepare chart data (cycle lengths)
  const chartData = [];
  const sortedPeriods = [...periods].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  for (let i = 0; i < sortedPeriods.length - 1; i++) {
    const current = new Date(sortedPeriods[i].startDate);
    const next = new Date(sortedPeriods[i+1].startDate);
    chartData.push({
      name: format(current, 'MMM d, yyyy'),
      length: differenceInDays(next, current),
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <h1 className="text-3xl font-bold tracking-tight text-primary">History & Trends</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Average Cycle Length</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{history?.avgCycleLength || '--'} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Average Period Length</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{history?.avgPeriodLength || '--'} days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cycle Length Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                />
                <Line type="monotone" dataKey="length" stroke="#5E8B7E" strokeWidth={3} dot={{ r: 4, fill: '#5E8B7E' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Not enough data to show trends. Log at least two cycles.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...sortedPeriods].reverse().map((period: PeriodLog) => (
              <div key={period.id} className="flex justify-between items-center p-4 border border-muted rounded-lg bg-card">
                <div>
                  <p className="font-semibold">{format(new Date(period.startDate), 'MMMM d, yyyy')}</p>
                  <p className="text-sm text-muted-foreground">
                    {period.endDate ? `Ended on ${format(new Date(period.endDate), 'MMM d, yyyy')}` : 'Currently active'}
                  </p>
                </div>
                {period.endDate && (
                  <div className="text-right">
                    <p className="font-medium text-primary">
                      {differenceInDays(new Date(period.endDate), new Date(period.startDate)) + 1} days long
                    </p>
                  </div>
                )}
              </div>
            ))}
            {sortedPeriods.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No past cycles logged yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

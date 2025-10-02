
import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressChartProps {
  progressData: Array<{
    month: string;
    score: number;
  }>;
  language: 'en' | 'pt';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  language: string;
}

const CustomTooltip = ({ active, payload, label, language }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
        <p className="font-medium">{label}</p>
        <p>
          {language === 'en' ? 'Score' : 'Pontuação'}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const ProgressChart: React.FC<ProgressChartProps> = ({ progressData, language }) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>{language === 'en' ? 'Learning Progress' : 'Progresso de Aprendizado'}</CardTitle>
        <CardDescription>
          {language === 'en' ? 'Your performance over time' : 'Seu desempenho ao longo do tempo'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]" config={{}}>
          <AreaChart data={progressData}>
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip language={language} />} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#progressGradient)" 
              name={language === 'en' ? 'Score' : 'Pontuação'}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;

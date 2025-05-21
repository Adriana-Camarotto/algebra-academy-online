
import React from 'react';
import { useAuthStore } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, LineChart, Line } from 'recharts';

const StudentDashboardPage = () => {
  const { language, user } = useAuthStore();

  // Mock data for progress chart
  const progressData = [
    { month: language === 'en' ? 'Jan' : 'Jan', score: 65 },
    { month: language === 'en' ? 'Feb' : 'Fev', score: 70 },
    { month: language === 'en' ? 'Mar' : 'Mar', score: 68 },
    { month: language === 'en' ? 'Apr' : 'Abr', score: 75 },
    { month: language === 'en' ? 'May' : 'Mai', score: 82 },
    { month: language === 'en' ? 'Jun' : 'Jun', score: 87 },
  ];

  // Mock data for upcoming lessons
  const upcomingLessons = [
    {
      id: 1,
      title: language === 'en' ? 'Calculus I' : 'Cálculo I',
      date: '2025-05-25',
      time: '15:00',
    },
    {
      id: 2,
      title: language === 'en' ? 'Algebra' : 'Álgebra',
      date: '2025-05-27',
      time: '14:30',
    },
  ];

  // Mock data for recent lessons
  const recentLessons = [
    {
      id: 1,
      title: language === 'en' ? 'Statistics' : 'Estatística',
      date: '2025-05-18',
      score: 85,
    },
    {
      id: 2,
      title: language === 'en' ? 'Trigonometry' : 'Trigonometria',
      date: '2025-05-15',
      score: 90,
    },
  ];

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'en'
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Welcome back, ' : 'Bem-vindo(a) de volta, '} 
          {user?.name.split(' ')[0]}!
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Upcoming Lessons' : 'Próximas Aulas'}</CardTitle>
            <CardDescription>
              {language === 'en' ? 'Your scheduled sessions' : 'Suas sessões agendadas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingLessons.length > 0 ? (
              <div className="space-y-4">
                {upcomingLessons.map(lesson => (
                  <div key={lesson.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(lesson.date)} • {lesson.time}
                      </p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {language === 'en' ? 'No upcoming lessons' : 'Sem aulas agendadas'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Recent Lesson History' : 'Histórico de Aulas Recentes'}</CardTitle>
          <CardDescription>
            {language === 'en' ? 'Your most recent completed lessons' : 'Suas aulas concluídas mais recentes'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{language === 'en' ? 'Subject' : 'Matéria'}</th>
                  <th className="text-left py-3 px-4">{language === 'en' ? 'Date' : 'Data'}</th>
                  <th className="text-left py-3 px-4">{language === 'en' ? 'Score' : 'Pontuação'}</th>
                </tr>
              </thead>
              <tbody>
                {recentLessons.map(lesson => (
                  <tr key={lesson.id} className="border-b">
                    <td className="py-3 px-4">{lesson.title}</td>
                    <td className="py-3 px-4">{formatDate(lesson.date)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-2 w-full max-w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${lesson.score}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{lesson.score}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Custom tooltip for the chart
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

export default StudentDashboardPage;

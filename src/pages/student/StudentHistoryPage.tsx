
import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const StudentHistoryPage = () => {
  const { language } = useAuthStore();
  
  // Mock lesson history data
  const lessonHistoryData = [
    {
      id: '1',
      subject: language === 'en' ? 'Calculus I' : 'Cálculo I',
      topic: language === 'en' ? 'Limits and Continuity' : 'Limites e Continuidade',
      date: '2025-05-10',
      duration: 60,
      score: 85,
    },
    {
      id: '2',
      subject: language === 'en' ? 'Algebra' : 'Álgebra',
      topic: language === 'en' ? 'Matrix Operations' : 'Operações com Matrizes',
      date: '2025-05-05',
      duration: 45,
      score: 90,
    },
    {
      id: '3',
      subject: language === 'en' ? 'Statistics' : 'Estatística',
      topic: language === 'en' ? 'Probability Distributions' : 'Distribuições de Probabilidade',
      date: '2025-04-28',
      duration: 60,
      score: 78,
    },
    {
      id: '4',
      subject: language === 'en' ? 'Geometry' : 'Geometria',
      topic: language === 'en' ? 'Vector Spaces' : 'Espaços Vetoriais',
      date: '2025-04-21',
      duration: 90,
      score: 92,
    },
    {
      id: '5',
      subject: language === 'en' ? 'Trigonometry' : 'Trigonometria',
      topic: language === 'en' ? 'Trigonometric Identities' : 'Identidades Trigonométricas',
      date: '2025-04-14',
      duration: 60,
      score: 88,
    },
  ];

  // Format date based on language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'en'
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Lesson History' : 'Histórico de Aulas'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language === 'en' 
            ? 'Review your past lessons and performance'
            : 'Reveja suas aulas anteriores e desempenho'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Past Lessons' : 'Aulas Anteriores'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'All your completed lessons with scores and details'
              : 'Todas as suas aulas concluídas com pontuações e detalhes'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? 'Subject' : 'Disciplina'}</TableHead>
                  <TableHead>{language === 'en' ? 'Topic' : 'Tópico'}</TableHead>
                  <TableHead>{language === 'en' ? 'Date' : 'Data'}</TableHead>
                  <TableHead>{language === 'en' ? 'Duration' : 'Duração'}</TableHead>
                  <TableHead>{language === 'en' ? 'Performance' : 'Desempenho'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessonHistoryData.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.subject}</TableCell>
                    <TableCell>{lesson.topic}</TableCell>
                    <TableCell>{formatDate(lesson.date)}</TableCell>
                    <TableCell>
                      {lesson.duration} {language === 'en' ? 'min' : 'min'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-full max-w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              lesson.score >= 90 
                                ? 'bg-green-500' 
                                : lesson.score >= 70 
                                  ? 'bg-blue-500' 
                                  : lesson.score >= 60 
                                    ? 'bg-yellow-500' 
                                    : 'bg-red-500'
                            }`}
                            style={{ width: `${lesson.score}%` }}
                          />
                        </div>
                        <span className={getScoreColor(lesson.score)}>
                          {lesson.score}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Performance Summary' : 'Resumo de Desempenho'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Overview of your learning journey'
              : 'Visão geral da sua jornada de aprendizado'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {lessonHistoryData.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'Total Lessons' : 'Total de Aulas'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(lessonHistoryData.reduce((sum, lesson) => sum + lesson.score, 0) / lessonHistoryData.length)}%
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'Average Score' : 'Pontuação Média'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(lessonHistoryData.reduce((sum, lesson) => sum + lesson.duration, 0) / 60)}h
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'Total Study Time' : 'Tempo Total de Estudo'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentHistoryPage;

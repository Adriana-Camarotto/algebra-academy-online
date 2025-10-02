import React from "react";
import { useAuthStore } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const StudentProgressPage = () => {
  const { language } = useAuthStore();

  // Mock progress data for different subjects
  const progressBySubject = [
    {
      subject: language === "en" ? "Algebra" : "Álgebra",
      initial: 45,
      current: 82,
      target: 90,
    },
    {
      subject: language === "en" ? "Calculus" : "Cálculo",
      initial: 30,
      current: 75,
      target: 85,
    },
    {
      subject: language === "en" ? "Statistics" : "Estatística",
      initial: 50,
      current: 88,
      target: 90,
    },
    {
      subject: language === "en" ? "Geometry" : "Geometria",
      initial: 40,
      current: 70,
      target: 80,
    },
    {
      subject: language === "en" ? "Trigonometry" : "Trigonometria",
      initial: 55,
      current: 85,
      target: 95,
    },
  ];

  // Mock data for progress over time
  const progressOverTime = [
    { month: language === "en" ? "Jan" : "Jan", score: 45 },
    { month: language === "en" ? "Feb" : "Fev", score: 52 },
    { month: language === "en" ? "Mar" : "Mar", score: 60 },
    { month: language === "en" ? "Apr" : "Abr", score: 70 },
    { month: language === "en" ? "May" : "Mai", score: 78 },
    { month: language === "en" ? "Jun" : "Jun", score: 85 },
  ];

  // Mock data for skills assessment
  const skillsData = [
    {
      subject: language === "en" ? "Problem Solving" : "Resolução de Problemas",
      score: 80,
      fullMark: 100,
    },
    {
      subject: language === "en" ? "Critical Thinking" : "Pensamento Crítico",
      score: 85,
      fullMark: 100,
    },
    {
      subject: language === "en" ? "Visualization" : "Visualização",
      score: 65,
      fullMark: 100,
    },
    {
      subject: language === "en" ? "Mental Maths" : "Cálculo Mental",
      score: 90,
      fullMark: 100,
    },
    {
      subject: language === "en" ? "Application" : "Aplicação",
      score: 70,
      fullMark: 100,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {language === "en"
            ? "My Learning Progress"
            : "Meu Progresso de Aprendizado"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language === "en"
            ? "Track your progress across different subjects and skills"
            : "Acompanhe seu progresso em diferentes matérias e habilidades"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en" ? "Subject Progress" : "Progresso por Matéria"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Your progress in each subject area"
                : "Seu progresso em cada área de estudo"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[350px]" config={{}}>
              <BarChart data={progressBySubject}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="initial"
                  fill="#8884d8"
                  name={language === "en" ? "Initial Level" : "Nível Inicial"}
                />
                <Bar
                  dataKey="current"
                  fill="#82ca9d"
                  name={language === "en" ? "Current Level" : "Nível Atual"}
                />
                <Bar
                  dataKey="target"
                  fill="#ffc658"
                  name={language === "en" ? "Target Level" : "Nível Alvo"}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en"
                ? "Progress Over Time"
                : "Progresso ao Longo do Tempo"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Your overall learning improvement"
                : "Sua melhora geral de aprendizado"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[350px]" config={{}}>
              <LineChart data={progressOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name={
                    language === "en"
                      ? "Performance Score"
                      : "Pontuação de Desempenho"
                  }
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {language === "en"
                ? "Skills Assessment"
                : "Avaliação de Habilidades"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Your strengths across different mathematical skills"
                : "Seus pontos fortes em diferentes habilidades matemáticas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[400px]" config={{}}>
              <RadarChart
                outerRadius={150}
                width={500}
                height={400}
                data={skillsData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name={
                    language === "en" ? "Skills Level" : "Nível de Habilidades"
                  }
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProgressPage;

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react';
import { TableauDashboard } from '@/components/TableauDashboard';
import { useDashboards } from '@/Apis/hooks';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const forecastData = [
  { month: 'Jan', actual: 42000, forecast: null },
  { month: 'Feb', actual: 38000, forecast: null },
  { month: 'Mar', actual: 52000, forecast: null },
  { month: 'Apr', actual: 48000, forecast: null },
  { month: 'May', actual: 61000, forecast: null },
  { month: 'Jun', actual: 55000, forecast: null },
  { month: 'Jul', actual: 67000, forecast: 65000 },
  { month: 'Aug', actual: null, forecast: 73000 },
  { month: 'Sep', actual: null, forecast: 78000 },
  { month: 'Oct', actual: null, forecast: 85000 },
  { month: 'Nov', actual: null, forecast: 92000 },
  { month: 'Dec', actual: null, forecast: 98000 },
];

const demandData = [
  { week: 'W1', demand: 1200, baseline: 1000 },
  { week: 'W2', demand: 1350, baseline: 1050 },
  { week: 'W3', demand: 1100, baseline: 1100 },
  { week: 'W4', demand: 1500, baseline: 1150 },
  { week: 'W5', demand: 1650, baseline: 1200 },
  { week: 'W6', demand: 1400, baseline: 1250 },
  { week: 'W7', demand: 1800, baseline: 1300 },
  { week: 'W8', demand: 1950, baseline: 1350 },
];

const predictions = [
  {
    title: 'Revenue Growth',
    prediction: '+15.3% expected in Q1 2026',
    confidence: 87,
    trend: 'up',
    description: 'Based on seasonal patterns and current momentum',
  },
  {
    title: 'Inventory Alert',
    prediction: 'Premium Headphones stock low by Feb',
    confidence: 92,
    trend: 'warning',
    description: 'Current sales velocity exceeds restock rate',
  },
  {
    title: 'Peak Demand Period',
    prediction: 'March 15-22 expected surge',
    confidence: 78,
    trend: 'up',
    description: 'Historical data suggests promotional opportunity',
  },
  {
    title: 'Regional Shift',
    prediction: 'West region outpacing East by 8%',
    confidence: 81,
    trend: 'down',
    description: 'Consider inventory reallocation',
  },
];

export default function Analytics() {
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
  const { data: dashboards, isLoading: isLoadingDashboards, error: dashboardsError } = useDashboards();
  const { toast } = useToast();

  // Auto-select first dashboard if available
  const selectedDashboard = dashboards?.find((d) => d.id === selectedDashboardId) || dashboards?.[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Predictive Analytics</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered forecasts and demand predictions for your business
        </p>
      </div>

      {/* Tableau Dashboard Section */}
      {dashboards && dashboards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-primary" size={20} />
              <h2 className="text-lg font-semibold text-foreground">Interactive Dashboards</h2>
            </div>
            {dashboards.length > 1 && (
              <Select
                value={selectedDashboardId || dashboards[0]?.id || ''}
                onValueChange={setSelectedDashboardId}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select a dashboard" />
                </SelectTrigger>
                <SelectContent>
                  {dashboards.map((dashboard) => (
                    <SelectItem key={dashboard.id} value={dashboard.id}>
                      {dashboard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedDashboard && (
            <TableauDashboard
              dashboard={selectedDashboard}
              height="800px"
              showToolbar={true}
              hideTabs={false}
            />
          )}
        </div>
      )}

      {isLoadingDashboards && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading dashboards...</p>
          </CardContent>
        </Card>
      )}

      {dashboardsError && (
        <Card className="shadow-sm border-destructive">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="text-destructive mx-auto mb-4" size={32} />
            <p className="text-muted-foreground">
              Failed to load dashboards. Showing static analytics below.
            </p>
          </CardContent>
        </Card>
      )}

      {(!dashboards || dashboards.length === 0) && !isLoadingDashboards && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No dashboards available. Showing static analytics below.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {predictions.map((pred) => (
          <Card key={pred.title} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    pred.trend === 'up'
                      ? 'bg-green-100'
                      : pred.trend === 'warning'
                      ? 'bg-orange-100'
                      : 'bg-red-100'
                  }`}
                >
                  {pred.trend === 'up' ? (
                    <TrendingUp className="text-green-600" size={16} />
                  ) : pred.trend === 'warning' ? (
                    <AlertTriangle className="text-orange-600" size={16} />
                  ) : (
                    <TrendingDown className="text-red-600" size={16} />
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {pred.confidence}% confidence
                </Badge>
              </div>
              <h3 className="font-medium text-foreground mb-1">{pred.title}</h3>
              <p className="text-sm text-primary font-medium mb-2">{pred.prediction}</p>
              <p className="text-xs text-muted-foreground">{pred.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Revenue Forecast</CardTitle>
            <CardDescription>Historical data with AI projections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number | null, name: string) => [
                      value ? `$${value.toLocaleString()}` : '-',
                      name === 'actual' ? 'Actual' : 'Forecast',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 2 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="hsl(142, 71%, 45%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(142, 71%, 45%)', strokeWidth: 2 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Forecast</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demand Trends */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Demand Trends</CardTitle>
            <CardDescription>Weekly demand vs baseline comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stackId="1"
                    stroke="hsl(var(--muted-foreground))"
                    fill="hsl(var(--muted))"
                  />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    stackId="2"
                    stroke="hsl(217, 91%, 60%)"
                    fill="hsl(217, 91%, 60%)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Patterns */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Key Insights</CardTitle>
          <CardDescription>AI-detected patterns and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-green-600" size={18} />
                <span className="font-medium text-green-800">Strong Growth</span>
              </div>
              <p className="text-sm text-green-700">
                Year-over-year revenue up 23%. Current trajectory suggests hitting annual targets ahead of schedule.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-orange-600" size={18} />
                <span className="font-medium text-orange-800">Attention Needed</span>
              </div>
              <p className="text-sm text-orange-700">
                3 products approaching stockout threshold. Recommend increasing reorder quantities for Q1.
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-primary" size={18} />
                <span className="font-medium text-primary">Opportunity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                West region shows 15% higher conversion rates. Consider targeted marketing campaigns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

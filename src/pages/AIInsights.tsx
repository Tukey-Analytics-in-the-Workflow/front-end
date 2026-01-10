import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Sparkles, Target, BarChart3, Lightbulb, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAIDecision } from '@/Apis/hooks';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import type { AIDecisionResponse, HTTPValidationError, AIQuery } from '@/Apis/types';
import { getErrorMessage } from '@/Apis/utils/errorHandler';

interface InsightResponse {
  query: AIQuery;
  decision: string;
  confidence: number;
  reason: string;
}

const timePeriods = [
  'Winter 2024',
  'Spring 2024', 
  'Summer 2024',
  'Fall 2024',
  'Q1 2024',
  'Q2 2024',
  'Q3 2024',
  'Q4 2024',
  'Holiday Season',
  'Back to School',
];

const regions = [
  'North',
  'South',
  'East',
  'West',
  'Northeast',
  'Southeast',
  'Midwest',
  'Southwest',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
];

const salesTrends = [
  'Increasing',
  'Decreasing',
  'Stable',
  'Volatile',
  'Seasonal Peak',
  'Seasonal Low',
];

const sampleProducts = [
  'Premium Headphones',
  'Wireless Keyboard',
  'Smart Watch Pro',
  'USB-C Hub',
  'Laptop Stand',
  'Vintage Speaker',
  'Classic Mouse',
];

export default function AIInsights() {
  const [timePeriod, setTimePeriod] = useState('');
  const [region, setRegion] = useState('');
  const [topProducts, setTopProducts] = useState<string[]>([]);
  const [salesTrend, setSalesTrend] = useState('');
  const [productInput, setProductInput] = useState('');
  const [response, setResponse] = useState<InsightResponse | null>(null);
  const [history, setHistory] = useState<InsightResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { mutate: getDecision, isPending: isLoading } = useAIDecision({
    onSuccess: (data: AIDecisionResponse, variables) => {
      // Transform API response to InsightResponse format
      const confidenceValue = typeof data.confidence === 'string' 
        ? data.confidence.toLowerCase() === 'high' ? 85 
        : data.confidence.toLowerCase() === 'medium' ? 65 
        : 45
        : Number(data.confidence) || 75;

      const insightResponse: InsightResponse = {
        query: variables,
        decision: data.decision || 'No decision available',
        confidence: confidenceValue,
        reason: data.reason || 'Analysis completed',
      };

      setResponse(insightResponse);
      setHistory((prev) => [insightResponse, ...prev.slice(0, 4)]);
      setError(null);
    },
    onError: (error: AxiosError<HTTPValidationError>) => {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleAddProduct = () => {
    if (productInput.trim() && topProducts.length < 5) {
      setTopProducts([...topProducts, productInput.trim()]);
      setProductInput('');
    }
  };

  const handleRemoveProduct = (productToRemove: string) => {
    setTopProducts(topProducts.filter(product => product !== productToRemove));
  };

  const handleSampleProduct = (product: string) => {
    if (topProducts.length < 5 && !topProducts.includes(product)) {
      setTopProducts([...topProducts, product]);
    }
  };

  const handleSubmit = async () => {
    if (!timePeriod || !region || topProducts.length === 0 || !salesTrend) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields and add at least one product.',
        variant: 'destructive',
      });
      return;
    }

    setError(null);

    // Call API with structured data
    getDecision({
      time_period: timePeriod,
      region: region,
      top_products: topProducts,
      sales_trend: salesTrend,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="text-primary" size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">AI Insights</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Get AI-powered business decisions based on your POS data
        </p>
      </div>

      {/* Input Form */}
      <Card className="shadow-lg border-2">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Time Period */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  {timePeriods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Region</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sales Trend */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sales Trend</label>
            <Select value={salesTrend} onValueChange={setSalesTrend}>
              <SelectTrigger>
                <SelectValue placeholder="Select sales trend" />
              </SelectTrigger>
              <SelectContent>
                {salesTrends.map((trend) => (
                  <SelectItem key={trend} value={trend}>
                    {trend}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Top Products */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Top Products (max 5)</label>
            <div className="flex gap-2">
              <Input
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="Enter product name"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProduct())}
                disabled={topProducts.length >= 5}
              />
              <Button 
                onClick={handleAddProduct} 
                disabled={!productInput.trim() || topProducts.length >= 5}
                type="button"
              >
                Add
              </Button>
            </div>
            
            {/* Sample Products */}
            <div className="flex flex-wrap gap-2 mt-2">
              {sampleProducts.slice(0, 4).map((product) => (
                <Button
                  key={product}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSampleProduct(product)}
                  disabled={topProducts.includes(product)}
                  className="text-xs"
                >
                  +{product}
                </Button>
              ))}
            </div>

            {/* Selected Products */}
            {topProducts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {topProducts.map((product) => (
                  <Badge key={product} variant="secondary" className="flex items-center gap-1">
                    {product}
                    <button
                      onClick={() => handleRemoveProduct(product)}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            size="lg" 
            className="w-full" 
            disabled={isLoading || !timePeriod || !region || topProducts.length === 0 || !salesTrend}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Target className="mr-2" size={20} />}
            Get AI Decision
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
            <p className="text-muted-foreground">Analyzing your data...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="shadow-sm border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle size={20} />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response Card */}
      {response && !isLoading && !error && (
        <Card className="shadow-lg overflow-hidden">
          <div className="bg-primary/5 px-6 py-4 border-b">
            <p className="text-sm text-muted-foreground">Query Parameters:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline">{response.query.time_period}</Badge>
              <Badge variant="outline">{response.query.region}</Badge>
              <Badge variant="outline">{response.query.sales_trend}</Badge>
              {response.query.top_products.map((product, index) => (
                <Badge key={index} variant="outline">{product}</Badge>
              ))}
            </div>
          </div>
          <CardContent className="p-6 space-y-6">
            {/* Decision */}
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Decision
                </p>
                <p className="text-lg font-semibold text-foreground">{response.decision}</p>
              </div>
            </div>

            {/* Confidence */}
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="text-green-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Confidence
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${response.confidence}%` }}
                    />
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {response.confidence}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Reasoning
                </p>
                <p className="text-foreground">{response.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 1 && !isLoading && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Previous Queries</h3>
          {history.slice(1).map((item, index) => (
            <button
              key={index}
              onClick={() => setResponse(item)}
              className="w-full text-left p-4 bg-card rounded-lg border hover:border-primary/50 transition-colors"
            >
              <p className="font-medium text-foreground">
                {item.query.region} - {item.query.time_period}
              </p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.decision}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

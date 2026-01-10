import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Calendar, BarChart3, TrendingUp, Package } from 'lucide-react';

const reports = [
  {
    id: '1',
    title: 'Monthly Sales Summary',
    description: 'Comprehensive overview of sales performance across all regions',
    type: 'Sales',
    date: 'Dec 31, 2025',
    size: '2.4 MB',
    icon: BarChart3,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: '2',
    title: 'Q4 Revenue Analysis',
    description: 'Detailed breakdown of Q4 revenue with YoY comparisons',
    type: 'Financial',
    date: 'Dec 28, 2025',
    size: '3.1 MB',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: '3',
    title: 'Inventory Status Report',
    description: 'Current stock levels, reorder points, and stockout risks',
    type: 'Inventory',
    date: 'Dec 25, 2025',
    size: '1.8 MB',
    icon: Package,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: '4',
    title: 'Weekly Performance Digest',
    description: 'Key metrics and highlights from the past week',
    type: 'Performance',
    date: 'Dec 22, 2025',
    size: '956 KB',
    icon: FileText,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: '5',
    title: 'Regional Sales Breakdown',
    description: 'Performance analysis by geographic region',
    type: 'Sales',
    date: 'Dec 20, 2025',
    size: '2.1 MB',
    icon: BarChart3,
    color: 'bg-primary/10 text-primary',
  },
  {
    id: '6',
    title: 'Product Performance Report',
    description: 'Top and bottom performing products with recommendations',
    type: 'Products',
    date: 'Dec 18, 2025',
    size: '1.5 MB',
    icon: Package,
    color: 'bg-orange-100 text-orange-600',
  },
];

const scheduledReports = [
  { name: 'Daily Sales Summary', frequency: 'Daily', nextRun: 'Tomorrow, 6:00 AM' },
  { name: 'Weekly Digest', frequency: 'Weekly', nextRun: 'Jan 6, 2026' },
  { name: 'Monthly Revenue Report', frequency: 'Monthly', nextRun: 'Feb 1, 2026' },
];

export default function Reports() {
  const { isAdmin } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and download generated reports and analytics
          </p>
        </div>
        {isAdmin && (
          <Button>
            <FileText size={18} className="mr-2" />
            Generate Report
          </Button>
        )}
      </div>

      {/* Scheduled Reports */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Scheduled Reports</CardTitle>
          <CardDescription>Automatically generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scheduledReports.map((report) => (
              <div
                key={report.name}
                className="p-4 bg-secondary/50 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{report.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {report.frequency}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Next: {report.nextRun}
                    </span>
                  </div>
                </div>
                <Calendar className="text-muted-foreground" size={20} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Recent Reports</CardTitle>
          <CardDescription>Download or preview your generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${report.color}`}>
                    <report.icon size={22} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {report.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{report.date}</span>
                      <span className="text-xs text-muted-foreground">{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye size={16} className="mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download size={16} className="mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

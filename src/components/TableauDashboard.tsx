import { useState, useEffect } from 'react';
import { TableauViz } from '@tableau/embedding-api-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useDashboardEmbedToken } from '@/Apis/hooks';
import { useToast } from '@/hooks/use-toast';
import type { Dashboard } from '@/Apis/types';

interface TableauDashboardProps {
  dashboard: Dashboard;
  height?: string;
  showToolbar?: boolean;
  hideTabs?: boolean;
}

/**
 * TableauDashboard Component
 * 
 * Embeds a Tableau visualization using the Tableau Embedding API React component.
 * This component handles:
 * - Fetching embed tokens from the API
 * - Loading states
 * - Error handling
 * - Tableau visualization rendering
 * 
 * Prerequisites:
 * - Node.js and npm installed
 * - React application set up
 * - @tableau/embedding-api-react package installed
 * - Valid Tableau Server/Cloud URL and embed token
 */
export function TableauDashboard({
  dashboard,
  height = '800px',
  showToolbar = true,
  hideTabs = false,
}: TableauDashboardProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const { toast } = useToast();

  const {
    mutate: fetchEmbedToken,
    isPending: isLoadingToken,
    isError: isTokenError,
  } = useDashboardEmbedToken({
    onSuccess: (data) => {
      // Construct the full Tableau embed URL with token
      // Format: https://your-tableau-server.com/views/Workbook/View?:embed=y&:token=TOKEN
      const baseUrl = data.embed_url || import.meta.env.VITE_TABLEAU_SERVER_URL || '';
      const token = data.token;
      
      if (baseUrl && token) {
        try {
          // Construct URL with embed token
          const url = new URL(baseUrl);
          url.searchParams.set('embed', 'y');
          url.searchParams.set('token', token);
          setEmbedUrl(url.toString());
        } catch (error) {
          // If URL construction fails, try appending query params manually
          const separator = baseUrl.includes('?') ? '&' : '?';
          setEmbedUrl(`${baseUrl}${separator}embed=y&token=${token}`);
        }
      } else if (data.embed_url) {
        // Fallback to embed_url if token is not provided
        // Add embed parameter if not present
        // const embedUrl = data.embed_url.includes('embed=')
        //   ? data.embed_url
        //   : `${data.embed_url}${data.embed_url.includes('?') ? '&' : '?'}embed=y`;
        setEmbedUrl(data.embed_url);
      } else {
        toast({
          title: 'Error',
          description: 'Invalid embed URL received from server',
          variant: 'destructive',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Failed to load dashboard',
        description: error.message || 'Could not fetch dashboard embed token',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    // Fetch embed token when component mounts
    if (dashboard.id) {
      fetchEmbedToken(dashboard.id);
    }
  }, [dashboard.id, fetchEmbedToken]);

  const handleFirstInteractive = () => {
    setIsInteractive(true);
  };

  const handleRefresh = () => {
    setIsInteractive(false);
    if (dashboard.id) {
      fetchEmbedToken(dashboard.id);
    }
  };

  if (isLoadingToken) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-8 flex flex-col items-center justify-center" style={{ height }}>
          <Loader2 className="animate-spin text-primary mb-4" size={32} />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  if (isTokenError || !embedUrl) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-8 flex flex-col items-center justify-center" style={{ height }}>
          <AlertCircle className="text-destructive mb-4" size={32} />
          <p className="text-muted-foreground mb-4">Failed to load dashboard</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2" size={16} />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-medium">{dashboard.name}</CardTitle>
          {dashboard.description && (
            <p className="text-sm text-muted-foreground mt-1">{dashboard.description}</p>
          )}
        </div>
        <Button onClick={handleRefresh} variant="ghost" size="sm" disabled={!isInteractive}>
          <RefreshCw className="mr-2" size={16} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height, position: 'relative' }}>
          {!isInteractive && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          )}
          <TableauViz
            src={embedUrl}
            toolbar={showToolbar ? 'bottom' : 'hidden'}
            hideTabs={hideTabs}
            onFirstInteractive={handleFirstInteractive}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

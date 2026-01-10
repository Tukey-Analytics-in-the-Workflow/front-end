# API Structure

This directory contains all API-related code organized in a clean, reusable structure.

## Structure

```
src/Apis/
├── axios.ts              # Axios instance configuration with interceptors
├── types.ts              # TypeScript types for API responses
├── endpoints/            # API endpoint functions organized by feature
│   ├── pos.ts           # POS-related endpoints
│   ├── dashboards.ts    # Dashboard-related endpoints
│   ├── ai.ts            # AI-related endpoints
│   ├── health.ts        # Health check endpoints
│   └── index.ts         # Exports all endpoints
├── hooks/                # React Query hooks for API calls
│   ├── usePos.ts        # POS upload hook
│   ├── useAI.ts         # AI decision hook
│   ├── useDashboards.ts # Dashboard hooks
│   ├── useHealth.ts     # Health check hook
│   └── index.ts         # Exports all hooks
├── utils/                # Utility functions
│   └── errorHandler.ts  # Error handling utilities
└── index.ts             # Main export file
```

## Usage

### Using React Query Hooks (Recommended)

The recommended way to use APIs is through React Query hooks, which provide built-in loading states, error handling, and caching.

#### Upload POS File

```typescript
import { useUploadPos } from '@/Apis/hooks';
import { useToast } from '@/hooks/use-toast';

function UploadComponent() {
  const { toast } = useToast();
  const { mutate: uploadFile, isPending } = useUploadPos({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
    },
  });

  const handleFileUpload = (file: File) => {
    uploadFile(file);
  };

  return (
    <button onClick={() => handleFileUpload(file)} disabled={isPending}>
      {isPending ? 'Uploading...' : 'Upload'}
    </button>
  );
}
```

#### Get AI Decision

```typescript
import { useAIDecision } from '@/Apis/hooks';
import { useToast } from '@/hooks/use-toast';

function AIComponent() {
  const { toast } = useToast();
  const { mutate: getDecision, isPending } = useAIDecision({
    onSuccess: (data) => {
      console.log('Decision:', data.decision);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to get AI decision',
        variant: 'destructive',
      });
    },
  });

  const handleQuery = (query: string) => {
    getDecision({ query });
  };

  return (
    <button onClick={() => handleQuery('Your question')} disabled={isPending}>
      {isPending ? 'Processing...' : 'Ask AI'}
    </button>
  );
}
```

#### List Dashboards

```typescript
import { useDashboards } from '@/Apis/hooks';

function DashboardList() {
  const { data: dashboards, isLoading, error } = useDashboards();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboards</div>;

  return (
    <div>
      {dashboards?.map((dashboard) => (
        <div key={dashboard.id}>{dashboard.name}</div>
      ))}
    </div>
  );
}
```

### Direct API Calls (Alternative)

You can also call APIs directly without hooks:

```typescript
import { uploadPos, getAIDecision, listDashboards } from '@/Apis';

// Direct call
const response = await uploadPos(file);
const decision = await getAIDecision({ query: 'Your question' });
const dashboards = await listDashboards();
```

## Configuration

The API base URL can be configured via environment variable:

```env
VITE_API_BASE_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`.

## Authentication

The axios instance automatically adds the authentication token from localStorage (`tukey_auth_token`) to all requests. If a 401 error occurs, the interceptor will automatically redirect to the login page.

## Error Handling

All endpoints use the configured axios instance which includes:
- Request interceptors for adding auth tokens
- Response interceptors for handling common errors (401, 403, 404, 500)
- Automatic error logging

You can handle errors in your components using try-catch blocks.

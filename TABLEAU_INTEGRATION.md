# Tableau Embedding API React Integration

## Implementation Summary

This document explains how the Tableau Embedding API React components have been integrated into the Tukey Decision Hub application.

## Installation

The Tableau Embedding API React package has been installed:

```bash
npm install @tableau/embedding-api-react
```

**Package**: `@tableau/embedding-api-react`  
**Version**: Latest (compatible with Tableau Server/Cloud 2024.1+)

## Prerequisites

✅ **Node.js**: Already installed (project requirement)  
✅ **React**: Version 18.3.1 (already installed)  
✅ **ES Modules**: Configured via Vite (no additional setup needed)  
✅ **TypeScript**: Already configured

## Project Structure

```
src/
├── components/
│   ├── TableauDashboard.tsx      # Wrapper component for Tableau visualizations
│   └── TableauDashboard.md        # Detailed documentation
├── pages/
│   └── Analytics.tsx              # Updated to use Tableau dashboards
└── Apis/
    └── endpoints/
        └── dashboards.ts          # API endpoints for dashboard management
```

## Components Created

### 1. TableauDashboard Component

**Location**: `src/components/TableauDashboard.tsx`

A reusable wrapper component that:
- Fetches embed tokens from the backend API
- Handles loading and error states
- Manages Tableau visualization rendering
- Provides refresh functionality

**Props**:
```typescript
interface TableauDashboardProps {
  dashboard: Dashboard;        // Dashboard object with id, name, description
  height?: string;             // Height of visualization (default: "800px")
  showToolbar?: boolean;        // Show Tableau toolbar (default: true)
  hideTabs?: boolean;          // Hide sheet tabs (default: false)
}
```

**Usage**:
```typescript
import { TableauDashboard } from '@/components/TableauDashboard';

<TableauDashboard
  dashboard={dashboard}
  height="800px"
  showToolbar={true}
  hideTabs={false}
/>
```

### 2. Updated Analytics Page

**Location**: `src/pages/Analytics.tsx`

The Analytics page now:
- Fetches available dashboards from the API
- Displays a dropdown to select dashboards (if multiple available)
- Renders the selected Tableau dashboard
- Falls back to static charts if no dashboards are available

## How It Works

### Step 1: Import the Component

```typescript
import { TableauViz } from '@tableau/embedding-api-react';
```

The `TableauViz` component is imported from the installed package.

### Step 2: Fetch Embed Token

When a dashboard is selected, the component calls:

```typescript
GET /dashboards/{dashboard_id}/embed-token
```

This returns:
```json
{
  "token": "embed_token_here",
  "embed_url": "https://tableau-server.com/views/Workbook/View",
  "expires_at": "2025-01-01T00:00:00Z"
}
```

### Step 3: Construct Tableau URL

The component constructs the full embed URL:

```
https://tableau-server.com/views/Workbook/View?:embed=y&:token=TOKEN
```

### Step 4: Render Visualization

The `TableauViz` component renders an iframe with the Tableau visualization:

```typescript
<TableauViz
  src={embedUrl}
  toolbar="bottom"
  hideTabs={false}
  onFirstInteractive={handleFirstInteractive}
/>
```

### Step 5: User Interaction

Once loaded, users can:
- Filter data
- Drill down into details
- Export data
- Use all Tableau interactive features

## Integration with Backend API

The implementation integrates with existing APIs:

1. **List Dashboards**: `GET /dashboards/`
   - Returns array of available dashboards
   - Used to populate the dashboard selector

2. **Get Embed Token**: `GET /dashboards/{id}/embed-token`
   - Returns embed token and URL
   - Called when a dashboard is selected
   - Token is used to authenticate the embed request

## Features

✅ **Automatic Token Management**: Fetches and refreshes tokens as needed  
✅ **Loading States**: Shows loading spinner while fetching token and rendering  
✅ **Error Handling**: Displays errors with retry functionality  
✅ **Multiple Dashboards**: Supports selecting from multiple available dashboards  
✅ **Responsive Design**: Adapts to container size  
✅ **Full Interactivity**: All Tableau features work (filtering, drilling, etc.)  
✅ **Refresh Capability**: Manual refresh button to reload dashboard

## Configuration

### Environment Variables

Optionally set in `.env`:

```env
VITE_TABLEAU_SERVER_URL=https://your-tableau-server.com
```

This is used as a fallback if `embed_url` is not provided by the API.

## Example Usage

### Basic Example

```typescript
import { TableauDashboard } from '@/components/TableauDashboard';
import { useDashboards } from '@/Apis/hooks';

function Analytics() {
  const { data: dashboards } = useDashboards();
  const dashboard = dashboards?.[0];

  if (!dashboard) return <div>No dashboards available</div>;

  return (
    <TableauDashboard
      dashboard={dashboard}
      height="800px"
    />
  );
}
```

### Advanced Example with Selection

```typescript
import { useState } from 'react';
import { TableauDashboard } from '@/components/TableauDashboard';
import { useDashboards } from '@/Apis/hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function Analytics() {
  const [selectedId, setSelectedId] = useState<string>('');
  const { data: dashboards } = useDashboards();
  
  const selectedDashboard = dashboards?.find(d => d.id === selectedId);

  return (
    <div>
      <Select value={selectedId} onValueChange={setSelectedId}>
        <SelectTrigger>
          <SelectValue placeholder="Select dashboard" />
        </SelectTrigger>
        <SelectContent>
          {dashboards?.map(dashboard => (
            <SelectItem key={dashboard.id} value={dashboard.id}>
              {dashboard.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedDashboard && (
        <TableauDashboard
          dashboard={selectedDashboard}
          height="800px"
          showToolbar={true}
        />
      )}
    </div>
  );
}
```

## Benefits

1. **Seamless Integration**: Tableau visualizations appear as native React components
2. **Secure**: Uses embed tokens for authentication
3. **Interactive**: Full Tableau functionality available to users
4. **Maintainable**: Clean component structure with error handling
5. **Flexible**: Supports multiple dashboards and configurations

## Troubleshooting

### Dashboard Not Loading

1. Verify embed token is valid and not expired
2. Check Tableau Server URL is correct
3. Ensure CORS is configured on Tableau Server
4. Check browser console for errors

### Token Issues

- Tokens expire after a set time
- Use the refresh button to fetch a new token
- Check API response for token expiration time

### CORS Errors

Configure Tableau Server to allow embedding from your domain:
- Tableau Server Admin → Settings → Embedded Views
- Add your domain to trusted sites

## Resources

- [Tableau Embedding API Documentation](https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_react.html)
- [Tableau Embedding API React Package](https://www.npmjs.com/package/@tableau/embedding-api-react)
- [Tableau Embedding API Guide](https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_get_started.html)

## Next Steps

1. Configure Tableau Server with your domain for CORS
2. Set up embed tokens in your backend API
3. Create dashboards in Tableau Server/Cloud
4. Test the integration with real dashboards

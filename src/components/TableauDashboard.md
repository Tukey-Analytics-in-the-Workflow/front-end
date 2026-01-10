# Tableau Embedding API React Integration Guide

## Overview

This guide explains how to install and use the Tableau Embedding API React components in this React application. The integration allows Tableau visualizations to be rendered and interacted with inside the React app.

## Prerequisites

1. **Node.js**: Version 16.x or higher
2. **React**: Version 18.x or higher (already installed)
3. **Existing React Setup**: This project uses Vite + React + TypeScript
4. **Tableau Server/Cloud**: Access to a Tableau Server or Tableau Cloud instance
5. **Embed Token**: Valid embed token from your backend API (`/dashboards/{id}/embed-token`)

## Installation

The Tableau Embedding API React package has been installed:

```bash
npm install @tableau/embedding-api-react
```

This installs the `@tableau/embedding-api-react` package which provides the `TableauViz` component.

## Project Configuration

The project is already configured for ES modules (using Vite), so no additional configuration is needed. The package works out of the box with the existing setup.

## Usage

### Basic Import

```typescript
import { TableauViz } from '@tableau/embedding-api-react';
```

### Using the TableauDashboard Component

We've created a wrapper component `TableauDashboard` that handles:
- Fetching embed tokens from the API
- Loading states
- Error handling
- Token management

```typescript
import { TableauDashboard } from '@/components/TableauDashboard';
import { useDashboards } from '@/Apis/hooks';

function Analytics() {
  const { data: dashboards } = useDashboards();
  const dashboard = dashboards?.[0];

  return (
    <TableauDashboard
      dashboard={dashboard}
      height="800px"
      showToolbar={true}
      hideTabs={false}
    />
  );
}
```

### Direct TableauViz Usage

For direct usage without the wrapper:

```typescript
import { TableauViz } from '@tableau/embedding-api-react';

function MyDashboard() {
  const tableauUrl = 'https://your-tableau-server.com/views/Workbook/View?:embed=y&:token=YOUR_TOKEN';

  return (
    <TableauViz
      src={tableauUrl}
      toolbar="bottom"
      hideTabs={false}
      onFirstInteractive={() => {
        console.log('Dashboard is interactive');
      }}
    />
  );
}
```

## Component Props

### TableauDashboard Props

- `dashboard`: Dashboard object with `id`, `name`, and optional `description`
- `height`: Height of the embedded visualization (default: "800px")
- `showToolbar`: Show/hide Tableau toolbar (default: true)
- `hideTabs`: Hide sheet tabs (default: false)

### TableauViz Props

- `src`: URL of the Tableau view to embed (required)
- `toolbar`: Position of toolbar - "top", "bottom", or "hidden" (default: "bottom")
- `hideTabs`: Boolean to hide sheet tabs (default: false)
- `onFirstInteractive`: Callback when visualization becomes interactive
- `device`: Device type - "default", "phone", or "tablet"
- `width`: Width of the visualization
- `height`: Height of the visualization

## Integration with Backend API

The component integrates with the existing dashboard API:

1. **List Dashboards**: `GET /dashboards/` - Returns available dashboards
2. **Get Embed Token**: `GET /dashboards/{dashboard_id}/embed-token` - Returns embed token and URL

The `TableauDashboard` component automatically:
- Fetches the embed token when mounted
- Constructs the full Tableau URL with the token
- Handles token expiration and refresh
- Manages loading and error states

## Environment Configuration

Optionally set the Tableau Server URL in `.env`:

```env
VITE_TABLEAU_SERVER_URL=https://your-tableau-server.com
```

## How It Works

1. **Component Mount**: When `TableauDashboard` mounts, it calls the embed token API
2. **Token Retrieval**: The API returns an embed token and optional embed URL
3. **URL Construction**: The component constructs the full Tableau URL with embed parameters
4. **Rendering**: The `TableauViz` component renders the iframe with the Tableau visualization
5. **Interactivity**: Once loaded, users can interact with the visualization (filter, drill down, etc.)
6. **Events**: The component handles `onFirstInteractive` to know when the viz is ready

## Features

- ✅ Automatic token management
- ✅ Loading states
- ✅ Error handling with retry
- ✅ Responsive design
- ✅ Multiple dashboard support
- ✅ Refresh functionality
- ✅ Full Tableau interactivity (filtering, drilling, etc.)

## Example: Analytics Page

The Analytics page demonstrates full integration:

```typescript
import { TableauDashboard } from '@/components/TableauDashboard';
import { useDashboards } from '@/Apis/hooks';

export default function Analytics() {
  const { data: dashboards } = useDashboards();
  const selectedDashboard = dashboards?.[0];

  return (
    <div>
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

## Troubleshooting

### Dashboard Not Loading

1. Check that the embed token is valid
2. Verify the Tableau Server URL is correct
3. Ensure CORS is configured on Tableau Server
4. Check browser console for errors

### Token Expired

The component will show an error. Use the refresh button to fetch a new token.

### CORS Issues

Ensure your Tableau Server allows embedding from your domain. Configure trusted sites in Tableau Server settings.

## Resources

- [Tableau Embedding API Documentation](https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_react.html)
- [Tableau Embedding API React Package](https://www.npmjs.com/package/@tableau/embedding-api-react)

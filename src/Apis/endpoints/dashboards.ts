import apiClient from '../axios';
import type {Dashboard, DashboardEmbedToken} from '../types';

/**
 * List all dashboards
 * @returns Promise with array of dashboards
 */
export const listDashboards = async (): Promise<Dashboard[]> => {
    // const response = await apiClient.get<Dashboard[]>('/dashboards/');
    return [
        {
            id: '1',
            name: 'Sales By Product',
        }
    ]
};

/**
 * Get embed token for a specific dashboard
 * @param dashboardId - ID of the dashboard
 * @returns Promise with embed token and related data
 */
export const getDashboardEmbedToken = async (
    dashboardId: string
): Promise<DashboardEmbedToken> => {
    return {
        embed_url: 'https://10ax.online.tableau.com/#/site/tukey-web-analytics/views/customer_shopping_data/SalesbyProductRegion',
    }
    // const response = await apiClient.get<DashboardEmbedToken>(
    //   `/dashboards/${dashboardId}/embed-token`
    // );
    // return response.data;
};

// Export types for use in components
export type {Dashboard, DashboardEmbedToken};

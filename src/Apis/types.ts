// API Response Types

// Validation Error Types
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// POS API Types
export interface UploadPosResponse {
  rows: number;
  columns: string[];
  sample: Record<string, any>[];
  [key: string]: unknown;
}

// Dashboard Types
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface DashboardEmbedToken {
  token: string;
  embed_url?: string;
  expires_at?: string;
  [key: string]: unknown;
}

// AI Decision Types
export interface AIQuery {
  time_period: string;
  region: string;
  top_products: string[];
  sales_trend: string;
  [key: string]: unknown;
}

export interface AIDecisionResponse {
  decision: string;
  confidence: string | number;
  reason: string;
  [key: string]: unknown;
}

// Health Check Types
export interface HealthResponse {
  status: string;
  version?: string;
  timestamp?: string;
  [key: string]: unknown;
}

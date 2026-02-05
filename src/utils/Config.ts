import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'config', '.env') });

interface AppConfig {
  baseUrl: string;
  apiBaseUrl: string;
  environment: string;
  timeout: {
    default: number;
    action: number;
    navigation: number;
  };
  retries: number;
  credentials: {
    email: string;
    password: string;
  };
  features: {
    enableVideo: boolean;
    enableScreenshots: boolean;
    enableTracing: boolean;
  };
}

function getEnvVariable(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export const config: AppConfig = {
  baseUrl: getEnvVariable('BASE_URL', 'https://demo.playwright.dev/todomvc'),
  apiBaseUrl: getEnvVariable('API_BASE_URL', 'https://api.example.com'),
  environment: getEnvVariable('ENVIRONMENT', 'staging'),
  timeout: {
    default: getEnvNumber('DEFAULT_TIMEOUT', 30000),
    action: getEnvNumber('ACTION_TIMEOUT', 15000),
    navigation: getEnvNumber('NAVIGATION_TIMEOUT', 30000),
  },
  retries: getEnvNumber('MAX_RETRIES', 3),
  credentials: {
    email: getEnvVariable('TEST_USER_EMAIL', 'testuser@example.com'),
    password: getEnvVariable('TEST_USER_PASSWORD', 'TestPassword123'),
  },
  features: {
    enableVideo: getEnvBoolean('ENABLE_VIDEO', true),
    enableScreenshots: getEnvBoolean('ENABLE_SCREENSHOTS', true),
    enableTracing: getEnvBoolean('ENABLE_TRACING', true),
  },
};

export function getEnvironmentConfig(env: string): Partial<AppConfig> {
  const environments: Record<string, Partial<AppConfig>> = {
    development: {
      baseUrl: 'http://localhost:3000',
      apiBaseUrl: 'http://localhost:8080/api',
    },
    staging: {
      baseUrl: 'https://staging.example.com',
      apiBaseUrl: 'https://staging-api.example.com',
    },
    production: {
      baseUrl: 'https://www.example.com',
      apiBaseUrl: 'https://api.example.com',
    },
  };

  return environments[env] || environments.staging;
}

export default config;

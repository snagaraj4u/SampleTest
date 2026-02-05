import { APIRequestContext, APIResponse } from '@playwright/test';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: object;
  timeout?: number;
}

export interface ApiResponse<T = unknown> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
  ok: boolean;
}

/**
 * API client wrapper for handling REST API requests.
 * Provides convenient methods for common HTTP operations.
 */
export class ApiClient {
  private request: APIRequestContext;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(
    request: APIRequestContext,
    baseUrl: string = '',
    defaultHeaders: Record<string, string> = {}
  ) {
    this.request = request;
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...defaultHeaders,
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url = `${url}?${queryString}`;
    }

    return url;
  }

  private mergeHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...customHeaders,
    };
  }

  private async parseResponse<T>(response: APIResponse): Promise<ApiResponse<T>> {
    let data: T;

    try {
      data = await response.json();
    } catch {
      data = (await response.text()) as unknown as T;
    }

    const headers: Record<string, string> = {};
    const headersArray = await response.headersArray();
    headersArray.forEach((h) => {
      headers[h.name] = h.value;
    });

    return {
      status: response.status(),
      statusText: response.statusText(),
      headers,
      data,
      ok: response.ok(),
    };
  }

  async get<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.mergeHeaders(options.headers);

    const response = await this.request.get(url, {
      headers,
      timeout: options.timeout,
    });

    return this.parseResponse<T>(response);
  }

  async post<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.mergeHeaders(options.headers);

    const response = await this.request.post(url, {
      headers,
      data: options.data,
      timeout: options.timeout,
    });

    return this.parseResponse<T>(response);
  }

  async put<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.mergeHeaders(options.headers);

    const response = await this.request.put(url, {
      headers,
      data: options.data,
      timeout: options.timeout,
    });

    return this.parseResponse<T>(response);
  }

  async patch<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.mergeHeaders(options.headers);

    const response = await this.request.patch(url, {
      headers,
      data: options.data,
      timeout: options.timeout,
    });

    return this.parseResponse<T>(response);
  }

  async delete<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.mergeHeaders(options.headers);

    const response = await this.request.delete(url, {
      headers,
      timeout: options.timeout,
    });

    return this.parseResponse<T>(response);
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

export default ApiClient;

import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api';
import { config } from '../../src/utils';

/**
 * API integration tests demonstrating the ApiClient usage.
 * Replace the endpoints with your actual API endpoints.
 */
test.describe('API Integration Tests', () => {
  let apiClient: ApiClient;

  test.beforeAll(async ({ request }) => {
    apiClient = new ApiClient(request, config.apiBaseUrl);
  });

  test.describe('Sample API Tests', () => {
    test.skip('should fetch data successfully @api', async () => {
      const response = await apiClient.get('/users');

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    });

    test.skip('should create resource successfully @api', async () => {
      const newUser = {
        name: 'Test User',
        email: 'testuser@example.com',
      };

      const response = await apiClient.post('/users', { data: newUser });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(201);
    });

    test.skip('should update resource successfully @api', async () => {
      const updatedData = {
        name: 'Updated User',
      };

      const response = await apiClient.put('/users/1', { data: updatedData });

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    test.skip('should delete resource successfully @api', async () => {
      const response = await apiClient.delete('/users/1');

      expect(response.ok).toBe(true);
    });

    test.skip('should handle authentication @api', async () => {
      apiClient.setAuthToken('test_token');

      const response = await apiClient.get('/protected-resource');

      expect(response.ok).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test.skip('should handle 404 errors @api', async () => {
      const response = await apiClient.get('/non-existent-endpoint');

      expect(response.status).toBe(404);
      expect(response.ok).toBe(false);
    });

    test.skip('should handle validation errors @api', async () => {
      const invalidData = {
        email: 'invalid-email',
      };

      const response = await apiClient.post('/users', { data: invalidData });

      expect(response.status).toBe(400);
    });
  });
});

/**
 * Placeholder test to ensure the test file runs.
 * Remove this when adding actual API tests.
 */
test('API client should be configurable', async ({ request }) => {
  const client = new ApiClient(request, 'https://api.example.com');

  client.setHeader('X-Custom-Header', 'value');
  client.setAuthToken('test_token');
  client.removeAuthToken();

  expect(true).toBe(true);
});

// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_API = 'https://reqres.in/api';

// Optional API key support if running under rate-limited environments
const defaultHeaders = {
  'Content-Type': 'application/json',
  ...(process.env.REQRES_API_KEY ? { 'x-api-key': process.env.REQRES_API_KEY } : {}),
};

test.describe('ReqRes REST API Suite (Part 4)', () => {
  test('API-01: GET /api/users?page=2 returns 200 with valid pagination and user list schema', async ({ request }) => {
    const response = await request.get(`${BASE_API}/users?page=2`, { headers: defaultHeaders });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        page: 2,
        per_page: expect.any(Number),
        total: expect.any(Number),
        total_pages: expect.any(Number),
        data: expect.any(Array),
      })
    );
    expect(body.data.length).toBeGreaterThan(0);

    for (const user of body.data) {
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
          first_name: expect.any(String),
          last_name: expect.any(String),
          avatar: expect.stringMatching(/^https?:\/\//),
        })
      );
    }
  });

  test('API-02: GET /api/users/2 returns 200 with expected single user object shape', async ({ request }) => {
    const response = await request.get(`${BASE_API}/users/2`, { headers: defaultHeaders });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data).toEqual({
      id: 2,
      email: 'janet.weaver@reqres.in',
      first_name: 'Janet',
      last_name: 'Weaver',
      avatar: expect.stringMatching(/^https:\/\/reqres\.in\/img\/faces\/2-image\.jpg$/),
    });
  });

  test('API-03: POST /api/users creates user with 201 and returns id + ISO createdAt', async ({ request }) => {
    const payload = { name: 'Ronak Oza', job: 'Junior QA Tester' };
    const response = await request.post(`${BASE_API}/users`, {
      headers: defaultHeaders,
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        name: payload.name,
        job: payload.job,
        id: expect.any(String),
        createdAt: expect.any(String),
      })
    );
    expect(body.id.length).toBeGreaterThan(0);
    expect(Number.isNaN(Date.parse(body.createdAt))).toBe(false);
  });

  test('API-04: POST /api/login with missing password returns 400 and error message', async ({ request }) => {
    const response = await request.post(`${BASE_API}/login`, {
      headers: defaultHeaders,
      data: { email: 'peter@klaven' },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toEqual({
      error: 'Missing password',
    });
  });

  test('API-05: POST /api/register with missing password returns 400 and error message', async ({ request }) => {
    const response = await request.post(`${BASE_API}/register`, {
      headers: defaultHeaders,
      data: { email: 'sydney@fife' },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toEqual({
      error: 'Missing password',
    });
  });

  test('API-06: GET /api/users/23 returns 404 Not Found with empty JSON object', async ({ request }) => {
    const response = await request.get(`${BASE_API}/users/23`, { headers: defaultHeaders });
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toEqual({});
  });
});

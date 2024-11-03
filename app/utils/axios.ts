import axios from "axios";

export const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2Q4MGQxMDNiZTYxNjRkMzgyOWMwYiIsImlhdCI6MTcyODU5MjA3NywiZXhwIjoxNzM2MzY4MDc3fQ.ioD-bcugzIAKGnsrFJz4mNPb2_3wEMfdHmrZ41kvmu4",
  },
});

export const userApi = axios.create({
  baseURL: process.env.CUSTOMER_API_URL,
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nzc5MDMzNTgyMDAyOSwiaWF0IjoxNzMwNTc3Mjk0LCJleHAiOjE3MzExODIwOTR9.8EI8l3F_0IrRkMMmP5UPV8PXyNEjbAXy7hpxxEbfsE0",
  },
});

export const apiFetch = (endpoint: string, options = {} as any) => {
  const { headers, ...restOptions } = options;

  return fetch(`${process.env.API_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2Q4MGQxMDNiZTYxNjRkMzgyOWMwYiIsImlhdCI6MTcyODU5MjA3NywiZXhwIjoxNzM2MzY4MDc3fQ.ioD-bcugzIAKGnsrFJz4mNPb2_3wEMfdHmrZ41kvmu4",
      "Content-Type": "application/json",
      ...headers,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  });
};

export const userApiFetch = (endpoint: string, options = {} as any) => {
  const { headers, ...restOptions } = options;

  return fetch(`${process.env.CUSTOMER_API_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nzc5MDMzNTgyMDAyOSwiaWF0IjoxNzI5OTMzMTY5LCJleHAiOjE3MzA1Mzc5Njl9.g-VhDtO7NBc_r0xv6dB43Hx-Wt4RfIgu_28omtDe-Kc",
      "Content-Type": "application/json",
      ...headers,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  });
};

import axios from "axios";

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

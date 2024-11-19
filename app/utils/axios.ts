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
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nzc5MDMzNTgyMDAyOSwiaWF0IjoxNzMyMDQ4NjY3LCJleHAiOjE3NjM2MDYyNjd9.DIJmmUM6Kxh234VUKjGXq7SewOZSXS3QL_jEUPmYFw0",
  },
});

export const apiFetch = async (endpoint: string, options = {} as any) => {
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

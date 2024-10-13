import axios from "axios";

export const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2Q4MGQxMDNiZTYxNjRkMzgyOWMwYiIsImlhdCI6MTcyODU5MjA3NywiZXhwIjoxNzM2MzY4MDc3fQ.ioD-bcugzIAKGnsrFJz4mNPb2_3wEMfdHmrZ41kvmu4",
  },
});

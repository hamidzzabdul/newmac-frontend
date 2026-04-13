export const api = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",

  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async get(endpoint: string) {
    return this.fetch(endpoint, { method: "GET" });
  },

  async post(endpoint: string, body: any) {
    return this.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async put(endpoint: string, body: any) {
    return this.fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
  async patch(endpoint: string, body: any) {
    return this.fetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async delete(endpoint: string) {
    return this.fetch(endpoint, { method: "DELETE" });
  },
};

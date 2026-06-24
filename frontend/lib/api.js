const BASE_URL = '';

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || 'Request failed');
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  auth: {
    login: (data) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    me: () => request('/api/auth/me'),
  },
  clients: {
    list: () => request('/api/clients'),
    get: (id) => request(`/api/clients/${id}`),
    create: (data) => request('/api/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/api/clients/${id}`, { method: 'DELETE' }),
  },
  accounts: {
    list: (clientId) => request(`/api/accounts/client/${clientId}`),
    create: (clientId, data) => request(`/api/accounts/client/${clientId}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/api/accounts/${id}`, { method: 'DELETE' }),
  },
  reports: {
    list: (clientId) => request(`/api/reports/client/${clientId}`),
    get: (id) => request(`/api/reports/${id}`),
    create: (clientId, data) => request(`/api/reports/client/${clientId}`, { method: 'POST', body: JSON.stringify(data) }),
    saveData: (id, data) => request(`/api/reports/${id}/data`, { method: 'PUT', body: JSON.stringify(data) }),
    calculate: (id) => request(`/api/reports/${id}/calculate`, { method: 'POST' }),
    generate: (id) => request(`/api/reports/${id}/generate`, { method: 'POST' }),
    downloadSACS: (id) => `${BASE_URL}/api/reports/${id}/pdf/sacs`,
    downloadTCC: (id) => `${BASE_URL}/api/reports/${id}/pdf/tcc`,
  },
};

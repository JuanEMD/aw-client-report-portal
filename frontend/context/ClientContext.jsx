import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../lib/api';

const ClientContext = createContext(null);

export function ClientProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);

  const loadClients = useCallback(async () => {
    const data = await api.clients.list();
    setClients(data);
  }, []);

  const loadClient = useCallback(async (id) => {
    const data = await api.clients.get(id);
    setCurrentClient(data);
    return data;
  }, []);

  const saveClient = useCallback(async (data, id) => {
    if (id) {
      const updated = await api.clients.update(id, data);
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    }
    const created = await api.clients.create(data);
    setClients((prev) => [...prev, created]);
    return created;
  }, []);

  const removeClient = useCallback(async (id) => {
    await api.clients.delete(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <ClientContext.Provider value={{ clients, currentClient, loadClients, loadClient, saveClient, removeClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error('useClients must be inside ClientProvider');
  return ctx;
}

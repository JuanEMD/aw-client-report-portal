import { useEffect } from 'react';
import { useClients } from '../../context/ClientContext';
import ClientCard from './ClientCard';
import Loading from '../../components/Loading';

export default function ClientList() {
  const { clients, loaded, loadClients, removeClient } = useClients();

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  if (!loaded) return <Loading />;

  if (!clients.length) {
    return (
      <div className="client-list client-list--empty">
        <div className="client-list__empty">
          <div className="client-list__empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M24 6v36M6 24h36" />
              <rect x="10" y="10" width="28" height="28" rx="4" />
            </svg>
          </div>
          <h2 className="client-list__empty-title">No clients yet</h2>
          <p className="client-list__empty-text">
            Add your first client to start generating SACS and TCC reports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-list">
      <div className="client-list__header">
        <h2 className="client-list__title">Clients</h2>
      </div>
      <div className="client-list__grid">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} onDelete={removeClient} />
        ))}
      </div>
    </div>
  );
}

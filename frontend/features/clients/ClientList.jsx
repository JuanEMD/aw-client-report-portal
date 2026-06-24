import { useEffect } from 'react';
import { useClients } from '../../context/ClientContext';
import ClientCard from './ClientCard';
import Loading from '../../components/Loading';

export default function ClientList() {
  const { clients, loadClients, removeClient } = useClients();

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  if (!clients.length) return <Loading />;

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

import { useState } from 'react';
import { useClients } from '../../context/ClientContext';
import ClientList from '../../features/clients/ClientList';
import ClientForm from '../../features/clients/ClientForm';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

export default function ClientsPage() {
  const { saveClient } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const handleCreate = async (data) => {
    await saveClient(data);
    setShowForm(false);
  };

  return (
    <div className="page-clients">
      <div className="page-clients__hd">
        <h1 className="page-clients__title">Clients</h1>
        <div className="page-clients__search">
          <svg className="page-clients__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3 3" />
          </svg>
          <input
            className="page-clients__search-input"
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          New Client
        </Button>
      </div>

      {showForm && (
        <Modal title="New Client" onClose={() => setShowForm(false)}>
          <ClientForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      <ClientList search={search} />
    </div>
  );
}

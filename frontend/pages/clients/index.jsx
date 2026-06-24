import { useState } from 'react';
import { useClients } from '../../context/ClientContext';
import ClientList from '../../features/clients/ClientList';
import ClientForm from '../../features/clients/ClientForm';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

export default function ClientsPage() {
  const { saveClient } = useClients();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (data) => {
    await saveClient(data);
    setShowForm(false);
  };

  return (
    <div className="page-clients">
      <div className="page-clients__toolbar">
        <Button variant="primary" onClick={() => setShowForm(true)}>
          New Client
        </Button>
      </div>

      {showForm && (
        <Modal title="New Client" onClose={() => setShowForm(false)}>
          <ClientForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      <ClientList />
    </div>
  );
}

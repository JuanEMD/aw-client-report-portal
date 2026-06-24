import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useClients } from '../../../context/ClientContext';
import { api } from '../../../lib/api';
import ClientForm from '../../../features/clients/ClientForm';
import Button from '../../../components/Button';
import Link from 'next/link';

export default function ClientDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { loadClient, currentClient } = useClients();
  const [accounts, setAccounts] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id) {
      loadClient(id);
      api.accounts.list(id).then(setAccounts).catch(() => {});
    }
  }, [id, loadClient]);

  const handleUpdate = async (data) => {
    await api.clients.update(id, data);
    loadClient(id);
    setEditing(false);
  };

  if (!currentClient) return <div className="loading">Loading...</div>;

  return (
    <div className="page-client">
      {editing ? (
        <ClientForm
          defaultValues={currentClient}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="page-client__header">
            <h2>{currentClient.full_name}</h2>
            {currentClient.spouse_name && <p>Spouse: {currentClient.spouse_name}</p>}
            <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
          </div>

          <div className="page-client__accounts">
            <h3>Accounts</h3>
            {accounts.length === 0 && <p>No accounts yet</p>}
            {accounts.map((acc) => (
              <div key={acc.id} className="account-row">
                <span>{acc.account_name}</span>
                <span>{acc.category}</span>
                <span>{acc.owner}</span>
                <span>${Number(acc.balance).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="page-client__reports">
            <h3>Reports</h3>
            <Link href={`/clients/${id}/reports/new`}>
              <Button variant="primary">New Report</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

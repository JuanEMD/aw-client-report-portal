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

  if (editing) {
    return (
      <div className="page-client">
        <ClientForm
          defaultValues={currentClient}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  const fmt = (v) => (v || 0).toLocaleString();

  return (
    <div className="page-client">
      <div className="client-detail__card">
        <div className="client-detail__accent" />
        <div className="client-detail__card-body">
          <div className="client-detail__hd">
            <div className="client-detail__hd-info">
              <h1 className="client-detail__name">{currentClient.full_name}</h1>
              {currentClient.spouse_name && (
                <p className="client-detail__spouse">Spouse: {currentClient.spouse_name}</p>
              )}
            </div>
            <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
          </div>
          <div className="client-detail__meta-row">
            <span className="client-detail__meta">
              DOB: {currentClient.dob ? new Date(currentClient.dob).toLocaleDateString() : '—'}
            </span>
            <span className="client-detail__sep">·</span>
            <span className="client-detail__meta">
              SSN: {currentClient.ssn_last4 ? `****${currentClient.ssn_last4}` : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="client-detail__section">
        <div className="client-detail__section-bar" />
        <div className="client-detail__section-body">
          <div className="client-detail__section-hd">
            <h2 className="client-detail__section-title">Accounts</h2>
            <span className="client-detail__count">{accounts.length}</span>
          </div>
          {accounts.length === 0 ? (
            <p className="client-detail__empty">No accounts yet. Create a report to add accounts.</p>
          ) : (
            <div className="client-detail__rows">
              {accounts.map((acc) => (
                <div key={acc.id} className="client-detail__row">
                  <div className="client-detail__row-info">
                    <span className="client-detail__row-name">{acc.type || acc.account_name || '—'}</span>
                    <span className={`client-detail__row-cat client-detail__cat--${acc.category || 'other'}`}>
                      {acc.category}
                    </span>
                  </div>
                  <div className="client-detail__row-right">
                    <span className="client-detail__row-owner">{acc.owner}</span>
                    <span className="client-detail__row-balance">${fmt(acc.balance)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="client-detail__section">
        <div className="client-detail__section-bar" />
        <div className="client-detail__section-body">
          <div className="client-detail__section-hd">
            <h2 className="client-detail__section-title">Reports</h2>
          </div>
          <Link href={`/clients/${id}/reports/new`}>
            <Button variant="primary">New Report</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

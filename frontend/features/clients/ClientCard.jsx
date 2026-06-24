import Link from 'next/link';
import Button from '../../components/Button';

export default function ClientCard({ client, onDelete }) {
  return (
    <div className="client-card">
      <div className="client-card__info">
        <h3 className="client-card__name">{client.full_name}</h3>
        {client.spouse_name && <p className="client-card__spouse">{client.spouse_name}</p>}
        <p className="client-card__meta">{client.account_count || 0} accounts</p>
        <p className="client-card__meta">
          Last report: {client.last_report_date ? new Date(client.last_report_date).toLocaleDateString() : 'Never'}
        </p>
      </div>
      <div className="client-card__actions">
        <Link href={`/clients/${client.id}`}>
          <Button variant="secondary">View</Button>
        </Link>
        <Button variant="danger" onClick={() => onDelete(client.id)}>Delete</Button>
      </div>
    </div>
  );
}

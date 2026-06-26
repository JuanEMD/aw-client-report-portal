import Link from 'next/link';
import Button from '../../components/Button';

export default function ClientCard({ client, onDelete }) {
  return (
    <div className="client-card">
      <div className="client-card__accent" />
      <div className="client-card__body">
        <div className="client-card__info">
          <div className="client-card__name-row">
            <h3 className="client-card__name">{client.full_name}</h3>
            {client.spouse_name && (
              <span className="client-card__badge">+ spouse</span>
            )}
          </div>
          {client.spouse_name && (
            <p className="client-card__spouse">{client.spouse_name}</p>
          )}
          <div className="client-card__meta-row">
            <span className="client-card__meta">{client.account_count || 0} accounts</span>
            <span className="client-card__divider">·</span>
            <span className="client-card__meta">
              {client.last_report_date
                ? new Date(client.last_report_date).toLocaleDateString()
                : 'No reports'}
            </span>
          </div>
        </div>
        <div className="client-card__actions">
          <Link href={`/clients/${client.id}`}>
            <Button variant="secondary" className="client-card__btn">View</Button>
          </Link>
          <Button variant="danger" onClick={() => onDelete(client.id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

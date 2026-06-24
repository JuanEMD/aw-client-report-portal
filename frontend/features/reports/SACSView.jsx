export default function SACSView({ data, client }) {
  if (!data) return <p>No SACS data</p>;

  return (
    <div className="sacs-view">
      <h3 className="sacs-view__title">SACS — Simple Automated Cash Flow</h3>
      <p className="sacs-view__client">{client.full_name}</p>

      <div className="sacs-view__diagram">
        <div className="sacs-view__bubble sacs-view__bubble--inflow">
          <span className="sacs-view__label">Inflow</span>
          <span className="sacs-view__amount">${data.inflow?.toLocaleString()}</span>
        </div>

        <div className="sacs-view__arrow">&darr;</div>

        <div className="sacs-view__bubble sacs-view__bubble--outflow">
          <span className="sacs-view__label">Outflow</span>
          <span className="sacs-view__amount">${data.outflow?.toLocaleString()}</span>
        </div>

        <div className="sacs-view__arrow">&darr;</div>

        <div className="sacs-view__bubble sacs-view__bubble--reserve">
          <span className="sacs-view__label">Private Reserve</span>
          <span className="sacs-view__amount">${data.excess?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

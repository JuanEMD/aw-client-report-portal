export default function TCCView({ data, client }) {
  if (!data) return <p>No TCC data</p>;

  const fmt = (v) => (v || 0).toLocaleString();

  return (
    <div className="tcc-view">
      <h3 className="tcc-view__title">TCC — Total Client Chart</h3>
      <p className="tcc-view__client">{client.full_name}</p>

      {data.main_client?.accounts?.length > 0 && (
        <div className="tcc-view__section">
          <h4>{client.full_name}</h4>
          {data.main_client.accounts.map((acc) => (
            <div key={acc.id} className="tcc-view__bubble">
              <span>{acc.name} ({acc.last4})</span>
              <span>
                ${fmt(acc.current_amount)} + ${fmt(acc.amount_to_invest)} = ${fmt((acc.current_amount || 0) + (acc.amount_to_invest || 0))}
              </span>
            </div>
          ))}
          <div className="tcc-view__total">Total: ${fmt(data.main_client.total)}</div>
        </div>
      )}

      {data.spouse?.accounts?.length > 0 && (
        <div className="tcc-view__section">
          <h4>{client.spouse_name || 'Spouse'}</h4>
          {data.spouse.accounts.map((acc) => (
            <div key={acc.id} className="tcc-view__bubble">
              <span>{acc.name} ({acc.last4})</span>
              <span>
                ${fmt(acc.current_amount)} + ${fmt(acc.amount_to_invest)} = ${fmt((acc.current_amount || 0) + (acc.amount_to_invest || 0))}
              </span>
            </div>
          ))}
          <div className="tcc-view__total">Total: ${fmt(data.spouse.total)}</div>
        </div>
      )}

      {data.non_retirement?.accounts?.length > 0 && (
        <div className="tcc-view__section">
          <h4>Non-Retirement</h4>
          {data.non_retirement.accounts.map((acc) => (
            <div key={acc.id} className="tcc-view__bubble">
              <span>{acc.name} ({acc.last4 || acc.id})</span>
              <span>${fmt((acc.current_amount || 0) + (acc.amount_to_invest || 0))}</span>
            </div>
          ))}
          <div className="tcc-view__total">Total: ${fmt(data.non_retirement.total)}</div>
        </div>
      )}

      {data.trust && data.trust.balance > 0 && (
        <div className="tcc-view__section tcc-view__section--trust">
          <h4>Trust</h4>
          <p>{data.trust.address || 'House Value'}</p>
          <p>${fmt(data.trust.balance)}</p>
        </div>
      )}

      {data.liabilities?.items?.length > 0 && (
        <div className="tcc-view__section tcc-view__section--liabilities">
          <h4>Liabilities</h4>
          {data.liabilities.items.map((l, i) => (
            <div key={i} className="tcc-view__liability">
              <span>{l.name} ({l.interestRate}%)</span>
              <span>${fmt(l.balance)}</span>
            </div>
          ))}
          <div className="tcc-view__total">Total: ${fmt(data.liabilities.total)}</div>
        </div>
      )}

      <div className="tcc-view__grand-total">
        Grand Total Net Worth: ${fmt(data.grand_total)}
      </div>
    </div>
  );
}

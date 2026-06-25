export default function TCCView({ data, client }) {
  if (!data) return <p className="tcc-view__empty">No TCC data</p>;

  const fmt = (v) => (v || 0).toLocaleString();

  return (
    <div className="tcc-view">
      <div className="tcc-view__accent" />
      <div className="tcc-view__hd">
        <h3 className="tcc-view__title">TCC — Total Client Chart</h3>
        <p className="tcc-view__client">{client.full_name}</p>
      </div>

      {data.main_client?.accounts?.length > 0 && (
        <div className="tcc-view__section">
          <h4 className="tcc-view__section-title">{client.full_name}</h4>
          <div className="tcc-view__rows">
            {data.main_client.accounts.map((acc) => {
              const total = (acc.current_amount || 0) + (acc.amount_to_invest || 0);
              return (
                <div key={acc.id} className="tcc-view__row">
                  <div className="tcc-view__row-info">
                    <span className="tcc-view__row-name">{acc.name}</span>
                    <span className="tcc-view__row-last4">{acc.last4}</span>
                  </div>
                  <div className="tcc-view__row-numbers">
                    <span className="tcc-view__row-total">${fmt(total)}</span>
                    <span className="tcc-view__row-breakdown">
                      ${fmt(acc.current_amount)} + ${fmt(acc.amount_to_invest)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="tcc-view__total">Total: ${fmt(data.main_client.total)}</div>
        </div>
      )}

      {data.spouse?.accounts?.length > 0 && (
        <div className="tcc-view__section">
          <h4 className="tcc-view__section-title">{client.spouse_name || 'Spouse'}</h4>
          <div className="tcc-view__rows">
            {data.spouse.accounts.map((acc) => {
              const total = (acc.current_amount || 0) + (acc.amount_to_invest || 0);
              return (
                <div key={acc.id} className="tcc-view__row">
                  <div className="tcc-view__row-info">
                    <span className="tcc-view__row-name">{acc.name}</span>
                    <span className="tcc-view__row-last4">{acc.last4}</span>
                  </div>
                  <div className="tcc-view__row-numbers">
                    <span className="tcc-view__row-total">${fmt(total)}</span>
                    <span className="tcc-view__row-breakdown">
                      ${fmt(acc.current_amount)} + ${fmt(acc.amount_to_invest)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="tcc-view__total">Total: ${fmt(data.spouse.total)}</div>
        </div>
      )}

      {data.non_retirement?.accounts?.length > 0 && (
        <div className="tcc-view__section">
          <h4 className="tcc-view__section-title">Non-Retirement</h4>
          <div className="tcc-view__rows">
            {data.non_retirement.accounts.map((acc) => {
              const total = (acc.current_amount || 0) + (acc.amount_to_invest || 0);
              return (
                <div key={acc.id} className="tcc-view__row">
                  <div className="tcc-view__row-info">
                    <span className="tcc-view__row-name">{acc.name}</span>
                    <span className="tcc-view__row-last4">{acc.last4 || acc.id}</span>
                  </div>
                  <div className="tcc-view__row-numbers">
                    <span className="tcc-view__row-total">${fmt(total)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="tcc-view__total">Total: ${fmt(data.non_retirement.total)}</div>
        </div>
      )}

      {data.trust && data.trust.balance > 0 && (
        <div className="tcc-view__section tcc-view__section--trust">
          <h4 className="tcc-view__section-title">Trust</h4>
          <div className="tcc-view__rows">
            <div className="tcc-view__row">
              <span className="tcc-view__row-name">{data.trust.address || 'House Value'}</span>
              <span className="tcc-view__row-total">${fmt(data.trust.balance)}</span>
            </div>
          </div>
        </div>
      )}

      {data.liabilities?.items?.length > 0 && (
        <div className="tcc-view__section tcc-view__section--liabilities">
          <h4 className="tcc-view__section-title">Liabilities</h4>
          <div className="tcc-view__rows">
            {data.liabilities.items.map((l, i) => (
              <div key={i} className="tcc-view__row">
                <span className="tcc-view__row-name">{l.name} ({l.interestRate}%)</span>
                <span className="tcc-view__row-total">${fmt(l.balance)}</span>
              </div>
            ))}
          </div>
          <div className="tcc-view__total">Total: ${fmt(data.liabilities.total)}</div>
        </div>
      )}

      <div className="tcc-view__grand-total">
        <span className="tcc-view__grand-label">Net Worth</span>
        <span className="tcc-view__grand-value">${fmt(data.grand_total)}</span>
      </div>
    </div>
  );
}

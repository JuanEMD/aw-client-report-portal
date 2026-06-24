export default function CalculationsSummary({ sacs, tcc, client }) {
  if (!sacs && !tcc) return null;

  const fmt = (v) => (v || 0).toLocaleString();

  return (
    <div className="calc-summary">
      <h3 className="calc-summary__title">Calculated Values</h3>

      {sacs && (
        <div className="calc-summary__section">
          <h4>SACS</h4>
          <p>Inflow: ${fmt(sacs.inflow)}</p>
          <p>Floor: ${fmt(sacs.floor)}</p>
          <p>Outflow: ${fmt(sacs.outflow)}</p>
          <p>Excess: ${fmt(sacs.excess)}</p>
          <p>Private Reserve</p>
          {sacs.deductibles?.length > 0 && (
            <div>
              <p>Deductibles:</p>
              {sacs.deductibles.map((d, i) => (
                <p key={i} className="calc-summary__sub">- {d.name}: ${fmt(d.amount)}</p>
              ))}
            </div>
          )}
          <p>FICA Account Balance: ${fmt(sacs.fica_account_balance)}</p>
          <p>Investment Account Balance: ${fmt(sacs.investment_balance)}</p>
        </div>
      )}

      {tcc && (
        <div className="calc-summary__section">
          <h4>TCC</h4>
          {tcc.main_client && (
            <p>{client?.full_name || 'Main Client'} Retirement: ${fmt(tcc.main_client.total)}</p>
          )}
          {tcc.spouse && (
            <p>{client?.spouse_name || 'Spouse'} Retirement: ${fmt(tcc.spouse.total)}</p>
          )}
          {tcc.non_retirement && (
            <p>Non-Retirement Total: ${fmt(tcc.non_retirement.total)}</p>
          )}
          {tcc.trust && <p>Trust: ${fmt(tcc.trust.balance)}</p>}
          <p><strong>Grand Total: ${fmt(tcc.grand_total)}</strong></p>
          {tcc.liabilities?.items?.length > 0 && (
            <div>
              <h4>Liabilities</h4>
              {tcc.liabilities.items.map((l, i) => (
                <p key={i}>{l.name} ({l.interestRate}%): ${fmt(l.balance)}</p>
              ))}
              <p>Total Liabilities: ${fmt(tcc.liabilities.total)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

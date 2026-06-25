function Row({ label, value, fmt, indent }) {
  return (
    <div className={`calc-summary__row${indent ? ' calc-summary__row--indent' : ''}`}>
      <span className="calc-summary__label">{label}</span>
      <span className="calc-summary__value">${fmt(value)}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h4 className="calc-summary__section-title">{children}</h4>;
}

export default function CalculationsSummary({ sacs, tcc, client }) {
  if (!sacs && !tcc) return null;

  const fmt = (v) => (v || 0).toLocaleString();

  return (
    <div className="calc-summary">
      <div className="calc-summary__accent" />
      <h3 className="calc-summary__title">Calculated Values</h3>

      <div className="calc-summary__grid">
        {sacs && (
          <div className="calc-summary__section">
            <SectionTitle>SACS</SectionTitle>
            <div className="calc-summary__rows">
              <Row label="Inflow" value={sacs.inflow} fmt={fmt} />
              <Row label="Floor" value={sacs.floor} fmt={fmt} />
              <Row label="Outflow" value={sacs.outflow} fmt={fmt} />
              <Row label="Excess" value={sacs.excess} fmt={fmt} />
              <Row label="Private Reserve" value={sacs.private_reserve} fmt={fmt} />
              {sacs.deductibles?.length > 0 && (
                <div className="calc-summary__sub-section">
                  <span className="calc-summary__sub-label">Deductibles</span>
                  {sacs.deductibles.map((d, i) => (
                    <Row key={i} label={d.name} value={d.amount} fmt={fmt} indent />
                  ))}
                </div>
              )}
              <Row label="FICA Account" value={sacs.fica_account_balance} fmt={fmt} />
              <Row label="Investment Account" value={sacs.investment_balance} fmt={fmt} />
            </div>
          </div>
        )}

        {tcc && (
          <div className="calc-summary__section">
            <SectionTitle>TCC</SectionTitle>
            <div className="calc-summary__rows">
              {tcc.main_client && (
                <Row label={`${client?.full_name || 'Client'} Retirement`} value={tcc.main_client.total} fmt={fmt} />
              )}
              {tcc.spouse && (
                <Row label={`${client?.spouse_name || 'Spouse'} Retirement`} value={tcc.spouse.total} fmt={fmt} />
              )}
              {tcc.non_retirement && (
                <Row label="Non-Retirement" value={tcc.non_retirement.total} fmt={fmt} />
              )}
              {tcc.trust && tcc.trust.balance > 0 && (
                <Row label="Trust" value={tcc.trust.balance} fmt={fmt} />
              )}
            </div>
          </div>
        )}
      </div>

      {tcc?.liabilities?.items?.length > 0 && (
        <div className="calc-summary__section calc-summary__section--full">
          <SectionTitle>Liabilities</SectionTitle>
          <div className="calc-summary__rows">
            {tcc.liabilities.items.map((l, i) => (
              <Row key={i} label={`${l.name} (${l.interestRate}%)`} value={l.balance} fmt={fmt} />
            ))}
            <Row label="Total Liabilities" value={tcc.liabilities.total} fmt={fmt} />
          </div>
        </div>
      )}

      {tcc?.grand_total > 0 && (
        <div className="calc-summary__grand-total">
          <span className="calc-summary__grand-label">Net Worth</span>
          <span className="calc-summary__grand-value">${fmt(tcc.grand_total)}</span>
        </div>
      )}
    </div>
  );
}

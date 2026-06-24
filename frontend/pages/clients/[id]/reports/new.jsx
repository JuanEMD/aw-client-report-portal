import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { useClients } from '../../../../context/ClientContext';
import { api } from '../../../../lib/api';
import ReportForm from '../../../../features/reports/ReportForm';
import CalculationsSummary from '../../../../features/reports/CalculationsSummary';
import Button from '../../../../components/Button';

export default function NewReportPage() {
  const router = useRouter();
  const { id } = router.query;
  const { loadClient, currentClient, loadClients } = useClients();
  const [accounts, setAccounts] = useState([]);
  const [reportId, setReportId] = useState(null);
  const [calculated, setCalculated] = useState(null);

  const regularAccounts = useMemo(() => accounts.filter((a) => a.category !== 'liability'), [accounts]);
  const liabilityAccounts = useMemo(() => accounts.filter((a) => a.category === 'liability'), [accounts]);

  useEffect(() => {
    if (id) {
      loadClient(id);
      api.accounts.list(id).then(setAccounts).catch(() => {});
    }
  }, [id, loadClient]);

  const handleSubmit = async (formData) => {
    let rId = reportId;

    if (!rId) {
      const now = new Date();
      const quarter = Math.floor((now.getMonth() + 3) / 3);
      const year = now.getFullYear();
      const report = await api.reports.create(id, { quarter, year });
      rId = report.id;
      setReportId(rId);
    }

    // Save report data first
    await api.reports.saveData(rId, formData);

    // Persist liabilities to accounts table
    const oldLiabilityIds = liabilityAccounts.map((a) => a.id);
    for (const oldId of oldLiabilityIds) {
      await api.accounts.delete(oldId).catch(() => {});
    }
    const liabilities = JSON.parse(formData.liabilities || '[]');
    for (const l of liabilities) {
      if (l.name || l.amount) {
        await api.accounts.create(id, {
          owner: l.name || '',
          category: 'liability',
          balance: Number(l.amount) || 0,
          interest_rate: Number(l.interestRate) || 0,
        });
      }
    }

    const updated = await api.accounts.list(id);
    setAccounts(updated);

    const calc = await api.reports.calculate(rId);
    setCalculated(calc);
    loadClients();
  };

  const handleSaveAccount = async (owner, data) => {
    const isC1 = owner === 'c1';
    let ownerVal = isC1 ? 'client_1' : 'client_2';
    let category = 'non_retirement';

    if (data.type === 'retirement') category = 'retirement';
    else if (data.type === 'joint') { category = 'non_retirement'; ownerVal = 'Joint'; }
    else if (data.type === 'trust') category = 'trust';
    if (ownerVal !== 'Joint') {
      ownerVal = isC1 ? currentClient.full_name : currentClient.spouse_name;
    }

    const created = await api.accounts.create(id, {
      owner: ownerVal,
      category,
      account_last4: data.last4 || '',
      balance: Number(data.current_amount) || 0,
    });

    setAccounts((prev) => [...prev, created]);
    return created;
  };

  const handleGenerate = async () => {
    if (!reportId) return;
    await api.reports.generate(reportId);
    router.push(`/clients/${id}/reports/${reportId}`);
  };

  if (!currentClient) return <div className="loading">Loading...</div>;

  return (
    <div className="page-report-new">
      <h2>New Report — {currentClient.full_name}</h2>
      <ReportForm
        client={currentClient}
        existingAccounts={regularAccounts}
        existingLiabilities={liabilityAccounts}
        clientId={id}
        onSaveAccount={handleSaveAccount}
        onSubmit={handleSubmit}
      />
      <CalculationsSummary client={currentClient} sacs={calculated?.sacs} tcc={calculated?.tcc} />
      {reportId && (
        <Button variant="primary" onClick={handleGenerate}>
          Generate PDFs
        </Button>
      )}
    </div>
  );
}

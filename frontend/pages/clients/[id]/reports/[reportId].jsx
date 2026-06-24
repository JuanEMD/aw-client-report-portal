import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useClients } from '../../../../context/ClientContext';
import { api } from '../../../../lib/api';
import ReportPreview from '../../../../features/reports/ReportPreview';

export default function ReportDetailPage() {
  const router = useRouter();
  const { id, reportId } = router.query;
  const { loadClient, currentClient } = useClients();
  const [report, setReport] = useState(null);
  const [calculations, setCalculations] = useState(null);

  useEffect(() => {
    if (id && reportId) {
      loadClient(id);
      api.reports.get(reportId).then(setReport).catch(() => {});
      api.reports.calculate(reportId).then(setCalculations).catch(() => {});
    }
  }, [id, reportId, loadClient]);

  if (!currentClient || !report) return <div className="loading">Loading...</div>;

  return (
    <ReportPreview
      report={report}
      client={currentClient}
      sacs={calculations?.sacs}
      tcc={calculations?.tcc}
    />
  );
}

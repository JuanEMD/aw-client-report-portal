import SACSView from './SACSView';
import TCCView from './TCCView';
import CalculationsSummary from './CalculationsSummary';
import Button from '../../components/Button';
import { api } from '../../lib/api';

export default function ReportPreview({ report, client, sacs, tcc }) {
  return (
    <div className="report-preview">
      <h2 className="report-preview__title">
        Report — Q{report.quarter} {report.year}
      </h2>

      <div className="report-preview__actions">
        <Button onClick={() => window.open(api.reports.downloadSACS(report.id), '_blank')}>
          Download SACS PDF
        </Button>
        <Button onClick={() => window.open(api.reports.downloadTCC(report.id), '_blank')}>
          Download TCC PDF
        </Button>
      </div>

      <CalculationsSummary client={client} sacs={sacs} tcc={tcc} />
      <SACSView data={sacs} client={client} />
      <TCCView data={tcc} client={client} />
    </div>
  );
}

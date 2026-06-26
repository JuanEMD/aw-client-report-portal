import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SACSView from './SACSView';
import TCCView from './TCCView';
import TCCDiagram from './TCCDiagram';
import CalculationsSummary from './CalculationsSummary';
import Button from '../../components/Button';

export default function ReportPreview({ report, client, sacs, tcc }) {
  const reportRef = useRef(null);

  const handleExportPDF = useCallback(async () => {
    const el = reportRef.current;
    if (!el) return;

    await new Promise(r => requestAnimationFrame(r));
    await new Promise(r => setTimeout(r, 100));

    const sections = [
      { selector: '.calc-summary', label: 'Calculated Values' },
      { selector: '.sacs-view', label: 'SACS' },
      { selector: '.tcc-view', label: 'TCC' },
      { selector: '.tcc-diagram', label: 'TCC Diagram' },
    ];

    const pdf = new jsPDF('p', 'pt', 'letter');
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < sections.length; i++) {
      const sectionEl = el.querySelector(sections[i].selector);
      if (!sectionEl) continue;

      const canvas = await html2canvas(sectionEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgW = canvas.width;
      const imgH = canvas.height;

      const margin = 40;
      const maxW = pdfW - margin * 2;
      const maxH = pdfH - margin * 2;
      const ratio = Math.min(maxW / imgW, maxH / imgH);
      const dw = imgW * ratio;
      const dh = imgH * ratio;
      const dx = (pdfW - dw) / 2;
      const dy = (pdfH - dh) / 2;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', dx, dy, dw, dh);
    }

    pdf.save(`Report_Q${report.quarter}_${report.year}.pdf`);
  }, [report]);

  return (
    <div className="report-preview">
      <h2 className="report-preview__title">
        Report — Q{report.quarter} {report.year}
      </h2>

      <div className="report-preview__actions">
        <Button onClick={handleExportPDF}>Export Full Report (PDF)</Button>
      </div>

      <div ref={reportRef}>
        <CalculationsSummary client={client} sacs={sacs} tcc={tcc} />
        <SACSView data={sacs} client={client} />
        <TCCView data={tcc} client={client} />
        <TCCDiagram client={client} tcc={tcc} />
      </div>
    </div>
  );
}

import { useRef, useEffect } from 'react';

const G = '#22c55e', R = '#ef4444', B = '#3b82f6', W = '#fff', GR = '#64748b', BG = '#f8fafc', BD = '#cbd5e1', LB = '#60a5fa', DB = '#1e40af';

function draw(ctx, d, client) {
  const r = 80;
  const cx1 = 300, cx2 = 630, cx3 = 465;
  const cy1 = 140, cy3 = 410;

  function circle(cx, cy, color, lines) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = W;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lh = 24;
    const sy = cy - ((lines.length - 1) * lh) / 2;
    lines.forEach(({ text, bold }, i) => {
      ctx.font = `${bold ? 'bold ' : ''}${bold ? 17 : 15}px sans-serif`;
      ctx.fillText(text, cx, sy + i * lh);
    });
  }

  function arrowHead(x, y, angle, color) {
    const as = 20, ret = -5;
    const tx = x - ret * Math.cos(angle);
    const ty = y - ret * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - as * Math.cos(angle - 0.4), ty - as * Math.sin(angle - 0.4));
    ctx.lineTo(tx - as * Math.cos(angle + 0.4), ty - as * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function clientBox(x, y, w, h, name, amount, color) {
    ctx.fillStyle = BG;
    ctx.strokeStyle = BD;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x + 14, y + 22);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = color || '#22c55e';
    ctx.fillText(amount, x + 14, y + 47);
  }

  // — Client info boxes (left of inflow) —
  const bx = 12, bw = 175, bh = 68;
  const boxRight = bx + bw;
  const c1y = cy1 - 72;
  clientBox(bx, c1y, bw, bh, client.full_name, `$${d.c1.toLocaleString()}/mo`);
  if (client.spouse_name) {
    const c2y = cy1 + 2;
    clientBox(bx, c2y, bw, bh, client.spouse_name, `$${d.c2.toLocaleString()}/mo`);
    // Connector arrows
    ctx.beginPath();
    ctx.moveTo(boxRight, c1y + bh / 2);
    ctx.lineTo(cx1 - r - 8, c1y + bh / 2);
    ctx.strokeStyle = GR;
    ctx.lineWidth = 3;
    ctx.stroke();
    arrowHead(cx1 - r - 8, c1y + bh / 2, 0, GR);
    ctx.beginPath();
    ctx.moveTo(boxRight, c2y + bh / 2);
    ctx.lineTo(cx1 - r - 8, c2y + bh / 2);
    ctx.stroke();
    arrowHead(cx1 - r - 8, c2y + bh / 2, 0, GR);
  } else {
    ctx.beginPath();
    ctx.moveTo(boxRight, c1y + bh / 2);
    ctx.lineTo(cx1 - r - 8, c1y + bh / 2);
    ctx.strokeStyle = GR;
    ctx.lineWidth = 3;
    ctx.stroke();
    arrowHead(cx1 - r - 8, c1y + bh / 2, 0, GR);
  }

  // — Circles —
  circle(cx1, cy1, G, [
    { text: 'INFLOW' },
    { text: `$${d.i.toLocaleString()}`, bold: true },
    { text: `Floor: $${d.f.toLocaleString()}` },
  ]);
  circle(cx2, cy1, R, [
    { text: 'OUTFLOW' },
    { text: `$${d.o.toLocaleString()}/mo`, bold: true },
    { text: `Floor: $${d.f.toLocaleString()}` },
  ]);
  circle(cx3, cy3, B, [
    { text: 'Private Reserve' },
    { text: `$${d.p.toLocaleString()}`, bold: true },
  ]);

  // — Red arrow (150px, rightward) —
  const ra1 = cx1 + r + 10, ra2 = ra1 + 140;
  ctx.fillStyle = R;
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`x = $${d.o.toLocaleString()}*/mo`, (ra1 + ra2) / 2, cy1 - 26);
  ctx.beginPath();
  ctx.moveTo(ra1, cy1);
  ctx.lineTo(ra2, cy1);
  ctx.strokeStyle = R;
  ctx.lineWidth = 4;
  ctx.stroke();
  arrowHead(ra2, cy1, 0, R);

  // — Note —
  ctx.fillStyle = GR;
  ctx.font = 'italic 14px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('x = monthly expenses', cx2 + r - 10, cy1 + r + 16);

  // — Blue L-arrow (90°: down then right) —
  const lx1 = cx1, ly1 = cy1 + r + 20;
  const cornerY = 410;
  const lx2 = cx3 - r - 15;
  ctx.fillStyle = B;
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`$${d.e.toLocaleString()}*/mo`, (lx1 + lx2) / 2, cornerY + 32);
  ctx.beginPath();
  ctx.moveTo(lx1, ly1);
  ctx.lineTo(lx1, cornerY);
  ctx.lineTo(lx2, cornerY);
  ctx.strokeStyle = B;
  ctx.lineWidth = 4;
  ctx.stroke();
  arrowHead(lx2, cornerY, 0, B);

  // — Dashed vertical line + bidirectional arrow —
  const dlY1 = cy3 + r, dlY2 = dlY1 + 100;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(cx3, dlY1);
  ctx.lineTo(cx3, dlY2);
  ctx.strokeStyle = GR;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.setLineDash([]);

  const baLen = 25;
  const baY = dlY2;
  ctx.beginPath();
  ctx.moveTo(cx3 - baLen, baY);
  ctx.lineTo(cx3 + baLen, baY);
  ctx.strokeStyle = GR;
  ctx.lineWidth = 3;
  ctx.stroke();
  arrowHead(cx3 - baLen, baY, Math.PI, GR);
  arrowHead(cx3 + baLen, baY, 0, GR);

  // — Small circles at arrow ends (same size as main) —
  const sr = 80;
  const fxCx = cx3 - baLen - sr - 10;
  const invCx = cx3 + baLen + sr + 10;

  circle(fxCx, baY, LB, [
    { text: 'FICA' },
    { text: `$${d.fb.toLocaleString()}`, bold: true },
  ]);
  circle(invCx, baY, DB, [
    { text: 'INVESTMENT' },
    { text: `$${d.ib.toLocaleString()}`, bold: true },
  ]);

  // — Labels below circles —
  ctx.fillStyle = '#334155';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = '14px sans-serif';
  ctx.fillText('6X Monthly Expenses + Deductibles', fxCx, baY + sr + 12);
  ctx.fillText('Remainder', invCx, baY + sr + 12);
}

export default function SACSView({ data, client }) {
  if (!data) return <p>No SACS data</p>;

  const d = {
    i: data.inflow || 0,
    o: data.outflow || 0,
    f: data.floor || 0,
    e: data.excess || ((data.inflow || 0) - (data.outflow || 0)),
    p: data.private_reserve || 0,
    fb: data.fica_account_balance || 0,
    ib: data.investment_balance || 0,
    c1: Number(client.monthly_salary) || 0,
    c2: Number(client.spouse_monthly_salary) || 0,
  };

  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = 750 * dpr;
    c.height = 750 * dpr;
    c.style.width = '750px';
    c.style.height = '750px';
    const ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 750, 750);
    draw(ctx, d, client);
  }, [d.i, d.o, d.f, d.e, d.p, client]);

  return (
    <div className="sacs-view">
      <h3 className="sacs-view__title">SACS — Simple Automated Cash Flow</h3>
      <p className="sacs-view__client">{client.full_name}{client.spouse_name ? ` & ${client.spouse_name}` : ''}</p>
      <canvas ref={ref} aria-label="SACS Cash Flow Diagram" />
    </div>
  );
}

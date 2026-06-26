import { useRef, useEffect } from 'react';

const G = '#22c55e', W = '#fff', GR = '#e2e8f0', DG = '#475569';
const RETIRE_TYPES = ['IRA', 'Roth IRA', '401K', 'Pension', 'retirement'];

function getAge(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function layout(tcc) {
  const pad = 16, r = 56;
  const darkGrayH = 36, gapRects = 8, grayH = 36;
  const nameH = 47, gapNameToDark = 12, rectGap = 14, retH = 30;
  const contentH = nameH + gapNameToDark + darkGrayH + gapRects + grayH + rectGap;
  const retY = Math.max(pad + 4, pad + contentH - 80);
  const gridTop = Math.max(retY + retH + 6, pad + 47 + gapNameToDark + darkGrayH + gapRects + grayH + 14);
  const gridH = 150;
  const gridBot = gridTop + gridH;
  const gapTextCircle = 16;
  const circleCy = gridBot + gapTextCircle + r;
  const topHalfH = Math.ceil((circleCy - pad + r + 14) / 10) * 10;
  const midY = pad + topHalfH;
  const liabCount = tcc?.liabilities?.items?.length || 0;
  const liabSectionH = liabCount > 0 ? 14 + 30 + liabCount * 22 + 10 + 10 : 14 + 10;
  const bottomExtra = liabSectionH + 36 + 20;
  const boxH = Math.ceil((midY - pad + 210 + bottomExtra) / 10) * 10;
  const nonRetireAccounts = [
    ...(tcc?.main_client?.accounts || []),
    ...(tcc?.spouse?.accounts || []),
    ...(tcc?.non_retirement?.accounts || []),
  ].filter(a => !RETIRE_TYPES.includes(a.name));
  const nonRetireTotal = nonRetireAccounts.reduce(
    (s, a) => s + (a.current_amount || 0) + (a.amount_to_invest || 0), 0
  );
  const gtText = `Grand Total: $${(tcc?.grand_total || 0).toLocaleString()}`;
  const liabText = `Total Liabilities: $${(tcc?.liabilities?.total || 0).toLocaleString()}`;
  const nrText = `NON RETIREMENT TOTAL: $${nonRetireTotal.toLocaleString()}`;
  const retireAccts1 = (tcc?.main_client?.accounts || []).filter(a => RETIRE_TYPES.includes(a.name));
  const retireAccts2 = (tcc?.spouse?.accounts || []).filter(a => RETIRE_TYPES.includes(a.name));
  const maxRetireTotal = Math.max(
    retireAccts1.reduce((s, a) => s + (a.current_amount || 0) + (a.amount_to_invest || 0), 0),
    retireAccts2.reduce((s, a) => s + (a.current_amount || 0) + (a.amount_to_invest || 0), 0)
  );
  const retireW = `Retirement: $${maxRetireTotal.toLocaleString()}`.length * 8 + 24;
  const gtW = gtText.length * 8 + 24;
  const liabW = liabText.length * 8 + 24;
  const nrW = nrText.length * 8 + 24;
  const boxW = Math.min(Math.max(420, gtW, liabW, nrW, retireW * 2 + 140), 700);
  const w = boxW + pad * 2, h = boxH + pad * 2;
  const midX = pad + boxW / 2;
  return {
    w, h, pad, r, darkGrayH, gapRects, grayH, retH,
    boxX: pad, boxY: pad, boxW: w - pad * 2, boxH, midX,
    circleCy, midY,
    textX: pad + 14, nameY: pad + 12, dateY: pad + 34,
    darkGrayY: pad + 47 + gapNameToDark,
    grayY: pad + 47 + gapNameToDark + darkGrayH + gapRects,
    retY, gridTop, gridBot,
  };
}

function drawAccountGrid(ctx, accounts, startX, endX, retY, retH, gridTop, gridBot, side) {
  const sideW = endX - startX;
  const retTotal = accounts.reduce(
    (s, a) => s + (a.current_amount || 0) + (a.amount_to_invest || 0), 0
  );
  const retLabel = `Retirement: $${retTotal.toLocaleString()}`;
  ctx.font = 'bold 12px sans-serif';
  const rw = ctx.measureText(retLabel).width + 16;
  let rx;
  if (side === 'left') {
    rx = Math.max(startX + 4, startX + (sideW - rw) / 2 - 50);
  } else {
    rx = Math.min(endX - rw - 4, startX + (sideW - rw) / 2 + 50);
  }
  ctx.fillStyle = DG;
  ctx.beginPath();
  ctx.roundRect(rx, retY, rw, retH, 5);
  ctx.fill();
  ctx.fillStyle = W;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(retLabel, rx + rw / 2, retY + retH / 2);

  const count = accounts.length;
  if (count === 0) return;

  const availY = gridBot - gridTop;
  const targetRows = Math.max(1, Math.ceil(Math.sqrt(count * sideW / availY)));
  const cols = Math.max(1, Math.ceil(count / targetRows));
  const rows = Math.ceil(count / cols);
  const cellW = sideW / cols;
  const cellH = availY / rows;
  const gap = 0;
  const acR = Math.max(22, Math.min(36, Math.floor(Math.min(cellW, cellH) / 2 - gap)));

  accounts.forEach((acc, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const acx = startX + cellW * (col + 0.5);
    const acy = gridTop + cellH * (row + 0.5);

    ctx.beginPath();
    ctx.arc(acx, acy, acR, 0, Math.PI * 2);
    ctx.fillStyle = W;
    ctx.fill();
    ctx.strokeStyle = DG;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = DG;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fsName = Math.max(7, Math.min(11, Math.floor(acR * 0.28)));
    const fsLast = Math.max(6, Math.min(10, Math.floor(acR * 0.24)));
    ctx.font = `bold ${fsLast}px sans-serif`;
    ctx.fillText(acc.last4 || '', acx, acy - 5);
    ctx.font = `${fsName}px sans-serif`;
    ctx.fillText(acc.name || '', acx, acy + 6);

    const invest = acc.amount_to_invest || 0;
    if (invest > 0 && acR >= 18) {
      const ir = Math.max(8, Math.min(15, Math.floor(acR * 0.33)));
      const icx = acx + acR - ir - 2;
      const icy = acy + acR - ir - 2;
      ctx.beginPath();
      ctx.arc(icx, icy, ir, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.fillStyle = W;
      ctx.font = `bold ${Math.max(5, Math.min(9, Math.floor(ir * 0.55)))}px sans-serif`;
      const invLabel = invest >= 1000 ? `${(invest / 1000).toFixed(1)}k` : String(invest);
      ctx.fillText(invLabel, icx, icy);
    }
  });
}

function drawNonRetireGrid(ctx, accounts, startX, endX, gridTop, gridBot) {
  const count = accounts.length;
  if (count === 0) return;

  const sideW = endX - startX;
  const availY = gridBot - gridTop;
  const targetRows = Math.max(1, Math.ceil(Math.sqrt(count * sideW / availY)));
  const cols = Math.max(1, Math.ceil(count / targetRows));
  const rows = Math.ceil(count / cols);
  const cellW = sideW / cols;
  const cellH = availY / rows;
  const gap = 5;
  const acR = Math.max(22, Math.min(36, Math.floor(Math.min(cellW, cellH) / 2 - gap)));

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Non-Retirement', (startX + endX) / 2, gridTop + 2);

  const topY = gridTop + 14;

  accounts.forEach((acc, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const acx = startX + cellW * (col + 0.5);
    const acy = topY + cellH * (row + 0.5);

    ctx.beginPath();
    ctx.arc(acx, acy, acR, 0, Math.PI * 2);
    ctx.fillStyle = W;
    ctx.fill();
    ctx.strokeStyle = DG;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = DG;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fsName = Math.max(7, Math.min(11, Math.floor(acR * 0.28)));
    const fsLast = Math.max(6, Math.min(10, Math.floor(acR * 0.24)));
    ctx.font = `bold ${fsLast}px sans-serif`;
    ctx.fillText(acc.last4 || '', acx, acy - 5);
    ctx.font = `${fsName}px sans-serif`;
    ctx.fillText(acc.name || '', acx, acy + 6);

    const invest = acc.amount_to_invest || 0;
    if (invest > 0 && acR >= 18) {
      const ir = Math.max(8, Math.min(15, Math.floor(acR * 0.33)));
      const icx = acx + acR - ir - 2;
      const icy = acy + acR - ir - 2;
      ctx.beginPath();
      ctx.arc(icx, icy, ir, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.fillStyle = W;
      ctx.font = `bold ${Math.max(5, Math.min(9, Math.floor(ir * 0.55)))}px sans-serif`;
      const invLabel = invest >= 1000 ? `${(invest / 1000).toFixed(1)}k` : String(invest);
      ctx.fillText(invLabel, icx, icy);
    }
  });
}

function draw(ctx, lay, client, tcc) {
  const { boxX, boxY, boxW, boxH, midX, r, circleCy, midY,
    textX, nameY, dateY, darkGrayY, darkGrayH, grayY, grayH, retY, retH,
    gridTop, gridBot } = lay;

  const grandTotal = tcc?.grand_total || 0;
  const liabTotal = tcc?.liabilities?.total || 0;
  const darkText = `Grand Total: $${grandTotal.toLocaleString()}`;
  const liabText = `Total Liabilities: $${liabTotal.toLocaleString()}`;

  // — Border + green dividing lines —
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 10);
  ctx.stroke();

  ctx.strokeStyle = G;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(boxX + 14, midY);
  ctx.lineTo(boxX + boxW - 14, midY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(midX, boxY);
  ctx.lineTo(midX, midY);
  ctx.stroke();

  // — Account circles (drawn first, behind other elements) —
  const mainRetire = (tcc?.main_client?.accounts || []).filter(a =>
    RETIRE_TYPES.includes(a.name)
  );
  drawAccountGrid(ctx, mainRetire, boxX + 14, midX - 14, retY, retH, gridTop, gridBot, 'left');

  if (client.spouse_name) {
    const spouseRetire = (tcc?.spouse?.accounts || []).filter(a =>
      RETIRE_TYPES.includes(a.name)
    );
    drawAccountGrid(ctx, spouseRetire, midX + 14, boxX + boxW - 14, retY, retH, gridTop, gridBot, 'right');
  }

  const botTop = midY + 10;
  const botBot = botTop + 210;

  const mainNonRetire = (tcc?.main_client?.accounts || []).filter(a =>
    !RETIRE_TYPES.includes(a.name)
  );
  drawNonRetireGrid(ctx, mainNonRetire, boxX + 14, midX - 14, botTop, botBot);

  if (client.spouse_name) {
    const spouseNonRetire = (tcc?.spouse?.accounts || []).filter(a =>
      !RETIRE_TYPES.includes(a.name)
    );
    drawNonRetireGrid(ctx, spouseNonRetire, midX + 14, boxX + boxW - 14, botTop, botBot);
  }

  // — Trust circle —
  const trustBalance = tcc?.trust?.balance || 0;
  if (trustBalance > 0) {
    const trustR = 48;
    const tcx = midX;
    const tcy = midY - trustR + 50;
    ctx.beginPath();
    ctx.arc(tcx, tcy, trustR, 0, Math.PI * 2);
    ctx.fillStyle = W;
    ctx.fill();
    ctx.strokeStyle = DG;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Trust', tcx, tcy - 8);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`$${trustBalance.toLocaleString()}`, tcx, tcy + 12);
  }

  // — Liabilities box —
  const liabItems = tcc?.liabilities?.items || [];
  let liabBoxY, liabBoxH;
  if (liabItems.length > 0) {
    ctx.font = 'bold 13px sans-serif';
    const titleW = ctx.measureText('Liabilities').width;
    ctx.font = 'bold 11px sans-serif';
    const hdrNameW = ctx.measureText('Name').width;
    const hdrAmtW = ctx.measureText('Amount').width;
    ctx.font = '12px sans-serif';
    let maxNameW = 0, maxAmtW = 0;
    liabItems.forEach(item => {
      const nw = ctx.measureText(item.name || '').width;
      const aw = ctx.measureText('$' + (item.balance || 0).toLocaleString()).width;
      if (nw > maxNameW) maxNameW = nw;
      if (aw > maxAmtW) maxAmtW = aw;
    });
    const colW = Math.max(hdrNameW, maxNameW) + 20 + Math.max(hdrAmtW, maxAmtW);
    const liabBoxW = Math.ceil(Math.max(titleW + 20, colW + 20, 200) / 10) * 10;
    liabBoxY = botBot + 14;
    liabBoxH = 30 + liabItems.length * 22 + 10;
    const liabBoxX = boxX + (boxW - liabBoxW) / 2;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(liabBoxX, liabBoxY, liabBoxW, liabBoxH, 6);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Liabilities', liabBoxX + 10, liabBoxY + 6);
    const hdrY = liabBoxY + 26;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Name', liabBoxX + 10, hdrY);
    ctx.textAlign = 'right';
    ctx.fillText('Amount', liabBoxX + liabBoxW - 10, hdrY);
    ctx.textAlign = 'left';
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(liabBoxX + 10, hdrY + 16);
    ctx.lineTo(liabBoxX + liabBoxW - 10, hdrY + 16);
    ctx.stroke();
    liabItems.forEach((item, i) => {
      const rowY = hdrY + 22 + i * 22;
      ctx.fillStyle = '#1e293b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.name || '', liabBoxX + 10, rowY);
      ctx.textAlign = 'right';
      ctx.fillText('$' + (item.balance || 0).toLocaleString(), liabBoxX + liabBoxW - 10, rowY);
      ctx.textAlign = 'left';
    });
  }

  // — NON RETIREMENT TOTAL rect —
  const nonRetireAccounts = [
    ...(tcc?.main_client?.accounts || []),
    ...(tcc?.spouse?.accounts || []),
    ...(tcc?.non_retirement?.accounts || []),
  ].filter(a => !RETIRE_TYPES.includes(a.name));
  const nonRetireTotal = nonRetireAccounts.reduce(
    (s, a) => s + (a.current_amount || 0) + (a.amount_to_invest || 0), 0
  );
  const nrY = liabItems.length > 0 ? liabBoxY + liabBoxH + 10 : botBot + 14 + 10;
  const nrLabel = `NON RETIREMENT TOTAL: $${nonRetireTotal.toLocaleString()}`;
  ctx.font = 'bold 14px sans-serif';
  const nrW = ctx.measureText(nrLabel).width + 24;
  const nrX = boxX + (boxW - nrW) / 2;
  ctx.fillStyle = DG;
  ctx.beginPath();
  ctx.roundRect(nrX, nrY, nrW, darkGrayH, 6);
  ctx.fill();
  ctx.fillStyle = W;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(nrLabel, nrX + nrW / 2, nrY + darkGrayH / 2);

  // — Main client name + date —
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(client.full_name, textX, nameY);

  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    textX, dateY
  );

  if (client.spouse_name) {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(client.spouse_name, boxX + boxW - 14, nameY);
  }

  // — Grand Total rect —
  ctx.font = 'bold 14px sans-serif';
  const darkW = ctx.measureText(darkText).width + 24;
  const darkX = boxX + (boxW - darkW) / 2;
  ctx.fillStyle = DG;
  ctx.beginPath();
  ctx.roundRect(darkX, darkGrayY, darkW, darkGrayH, 6);
  ctx.fill();
  ctx.fillStyle = W;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(darkText, darkX + darkW / 2, darkGrayY + darkGrayH / 2);

  // — Liabilities rect —
  const liabW = ctx.measureText(liabText).width + 24;
  const liabX = boxX + (boxW - liabW) / 2;
  ctx.fillStyle = GR;
  ctx.beginPath();
  ctx.roundRect(liabX, grayY, liabW, grayH, 6);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.fillText(liabText, liabX + liabW / 2, grayY + grayH / 2);

  // — Green circles with client info —
  function fillCircle(cx, cy, lines) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = G;
    ctx.fill();
    ctx.fillStyle = W;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lh = 20;
    const sy = cy - ((lines.length - 1) * lh) / 2;
    lines.forEach(({ text, bold, size }, i) => {
      ctx.font = `${bold ? 'bold ' : ''}${size || 12}px sans-serif`;
      ctx.fillText(text, cx, sy + i * lh);
    });
  }

  const c1cx = boxX + boxW * 0.25;
  const c2cx = boxX + boxW * 0.75;

  const c1Age = getAge(client.dob);
  const c1Last4 = client.ssn_last4 ? `****${client.ssn_last4}` : '';
  fillCircle(c1cx, circleCy, [
    { text: client.full_name, bold: true, size: 12 },
    { text: c1Age ? `${c1Age} yrs` : '', bold: true, size: 15 },
    { text: c1Last4, size: 11 },
  ]);

  if (client.spouse_name) {
    const c2Age = getAge(client.spouse_dob);
    const c2Last4 = client.spouse_ssn_last4 ? `****${client.spouse_ssn_last4}` : '';
    fillCircle(c2cx, circleCy, [
      { text: client.spouse_name, bold: true, size: 12 },
      { text: c2Age ? `${c2Age} yrs` : '', bold: true, size: 15 },
      { text: c2Last4, size: 11 },
    ]);
  }
}

export default function TCCDiagram({ client, tcc }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const S = 1.4;
    const lay = layout(tcc);
    c.width = lay.w * dpr * S;
    c.height = lay.h * dpr * S;
    c.style.width = lay.w * S + 'px';
    c.style.height = lay.h * S + 'px';
    const ctx = c.getContext('2d');
    ctx.scale(dpr * S, dpr * S);
    draw(ctx, lay, client, tcc);
  }, [client, tcc]);

  return (
    <div className="tcc-diagram">
      <h3 className="tcc-diagram__title">TCC — Diagram</h3>
      <canvas ref={ref} aria-label="TCC Diagram" />
    </div>
  );
}

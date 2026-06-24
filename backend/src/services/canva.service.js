// TODO: Implement Canva export via Canva API
// Requires CANVA_API_KEY env var

async function exportToCanva(reportData, _clientData) {
  // STUB
  // const response = await fetch('https://api.canva.com/...', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${process.env.CANVA_API_KEY}` },
  //   body: JSON.stringify(reportData),
  // });
  // return response.json();
  return { error: 'Canva export not implemented' };
}

module.exports = { exportToCanva };

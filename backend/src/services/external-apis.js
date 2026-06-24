// TODO: Implement external API integrations for V2
// - RightCapital API (auto-pull balances) — deferred to V2
// - Schwab API (compliance restrictions) — deferred to V2
// - Pinnacle Bank (secure email) — deferred to V2
// - Zillow API (auto-pull Zestimate) — deferred to V2
// - Dropbox auto-save — not confirmed

async function syncRightCapital(_clientId) {
  return { error: 'RightCapital integration not implemented (V2)' };
}

async function syncSchwab(_clientId) {
  return { error: 'Schwab integration not implemented (V2)' };
}

async function getZillowEstimate(_address) {
  return { error: 'Zillow integration not implemented (V2)' };
}

async function saveToDropbox(_file, _path) {
  return { error: 'Dropbox integration not implemented' };
}

module.exports = { syncRightCapital, syncSchwab, getZillowEstimate, saveToDropbox };

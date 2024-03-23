const dopplerPhase = require('csgo-doppler-phase');

module.exports = (name, icon, largeIcon) => {
  let phase = dopplerPhase.detect(name, icon);
  if (!phase) return { hasPhase: false, phase };
  if (phase === 'Something wrong with your icon_url') phase = dopplerPhase.detect(name, largeIcon);
  return { hasPhase: true, phase };
};

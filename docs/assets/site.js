'use strict';

const dollars = value => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(value);
const tripForm = document.querySelector('#trip-demo');
tripForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!tripForm.reportValidity()) return;
  const payout = Number(tripForm.elements.payout.value);
  const miles = Number(tripForm.elements.miles.value);
  const minutes = Number(tripForm.elements.minutes.value);
  const status = document.querySelector('#trip-status');
  if (![payout,miles,minutes].every(Number.isFinite) || payout < 0 || miles < 0 || minutes <= 0) {
    status.textContent = 'Use nonnegative costs and a positive total time.';
    return;
  }
  const net = payout - miles * 0.30;
  document.querySelector('#trip-net').textContent = dollars(net);
  document.querySelector('#trip-hourly').textContent = dollars(net / (minutes / 60));
  status.textContent = 'Updated with your inputs.';
});

const profiles = {
  standard: {bitrate:'2500k',fps:'30 fps',preset:'medium'},
  'low-bandwidth': {bitrate:'900k',fps:'24 fps',preset:'medium'},
  'low-latency': {bitrate:'2500k',fps:'30 fps',preset:'veryfast'}
};
const profileSelect = document.querySelector('#stream-profile');
profileSelect.addEventListener('change', () => {
  const profile = profiles[profileSelect.value];
  if (!profile) return;
  document.querySelector('#stream-command').textContent = `./stream.sh --file movie.mp4 \\\n  --profile ${profileSelect.value}`;
  document.querySelector('#stream-bitrate').textContent = profile.bitrate;
  document.querySelector('#stream-fps').textContent = profile.fps;
  document.querySelector('#stream-preset').textContent = profile.preset;
  document.querySelector('#copy-status').textContent = '';
});
document.querySelector('#copy-command').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(document.querySelector('#stream-command').textContent);
    status.textContent = 'Copied.';
  } catch {
    status.textContent = 'Select the command to copy it.';
  }
});

const careers = [
  [1,'Gutter Minder'],[11,'Lost Expeditioneer'],[21,'Star Blessed'],
  [31,'Polar Bounty Hunter'],[41,'Newspaper Intern'],[51,'Front of House Host'],
  [61,'Council Runner'],[71,'Living Experiment'],[81,'Animal Vassal'],[91,'Sub-Person']
];
const d6 = () => Math.floor(Math.random() * 6) + 1;
document.querySelector('#roll-character').addEventListener('click', () => {
  const abilities = Array.from({length:3}, () => d6() + d6() + d6());
  const low = Math.min(...abilities), high = Math.max(...abilities);
  const number = high >= 12 ? (high % 10) * 10 + 2 + Math.min(low,12) : high === 11 ? 13 + low : high === 10 ? low + 5 : low - 2;
  const career = careers.reduce((closest,current) => Math.abs(current[0]-number) < Math.abs(closest[0]-number) ? current : closest);
  document.querySelector('#character-career').textContent = career[1];
  ['str','dex','cha'].forEach((ability,index) => {
    document.querySelector(`#character-${ability}`).textContent = String(abilities[index]);
  });
  document.querySelector('#character-hp').textContent = String(d6());
  document.querySelector('#character-money').textContent = `£${d6()}`;
});

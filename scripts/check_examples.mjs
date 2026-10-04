// Test the browser examples as JavaScript with a small DOM fixture; no browser required.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const elements = new Map();
function node(selector) {
  if (!elements.has(selector)) elements.set(selector, {
    textContent: '', value: '', listeners: {},
    addEventListener(event, handler) { this.listeners[event] = handler; }
  });
  return elements.get(selector);
}
const form = node('#trip-demo');
form.elements = {payout:{value:'30'},miles:{value:'10'},minutes:{value:'40'}};
form.reportValidity = () => true;
let copied = '';
const context = vm.createContext({
  document: {querySelector: node}, Intl, Math, Number, Array,
  navigator: {clipboard: {writeText: async text => {copied = text;}}}
});
vm.runInContext(fs.readFileSync(new URL('../docs/assets/site.js',import.meta.url),'utf8'),context);
form.listeners.submit({preventDefault(){}});
assert.equal(node('#trip-net').textContent,'$27.00');
assert.equal(node('#trip-hourly').textContent,'$40.50');
form.elements.minutes.value = '0';
form.listeners.submit({preventDefault(){}});
assert.match(node('#trip-status').textContent,/positive/);

node('#stream-profile').value = 'low-bandwidth';
node('#stream-profile').listeners.change();
assert.equal(node('#stream-bitrate').textContent,'900k');
assert.equal(node('#stream-fps').textContent,'24 fps');
assert.equal(node('#stream-command').textContent,'./stream.sh --file movie.mp4 \\\n  --profile low-bandwidth');
await node('#copy-command').listeners.click();
assert.equal(copied,node('#stream-command').textContent);
assert.equal(node('#copy-status').textContent,'Copied.');

for (let i=0;i<100;i++) {
  node('#roll-character').listeners.click();
  for (const ability of ['str','dex','cha']) {
    const value = Number(node(`#character-${ability}`).textContent);
    assert.ok(value>=3 && value<=18);
  }
  assert.ok(Number(node('#character-hp').textContent)>=1);
  assert.ok(Number(node('#character-hp').textContent)<=6);
  assert.ok(node('#character-career').textContent.length>0);
}
console.log('All three project examples passed their behavior checks.');

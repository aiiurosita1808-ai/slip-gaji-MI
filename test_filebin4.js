import fetch from 'node-fetch';
import fs from 'fs';
const blob = fs.readFileSync('package.json');
const binId = 'slip' + Date.now();
const url = `https://filebin.net/${binId}/slip.pdf`;
fetch(url, { method: 'POST', body: blob, headers: { 'Content-Type': 'text/plain' } })
  .then(res => res.text())
  .then(text => console.log("Filebin text response:", text))
  .catch(console.error);

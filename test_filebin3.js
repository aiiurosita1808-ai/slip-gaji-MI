import fetch from 'node-fetch';
import fs from 'fs';
const blob = fs.readFileSync('package.json'); // sending text as dummy pdf
const url = 'https://filebin.net/testbinabc123/slip.pdf';
fetch(url, { method: 'POST', body: blob, headers: { 'Content-Type': 'text/plain' } })
  .then(res => res.text())
  .then(text => console.log("Filebin text response:", text))
  .catch(console.error);

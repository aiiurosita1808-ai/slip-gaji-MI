import fetch from 'node-fetch';
const blob = Buffer.from('test pdf content');
const url = 'https://filebin.net/testbin12345/' + Date.now() + '.pdf';
fetch(url, { method: 'POST', body: blob, headers: { 'Content-Type': 'text/plain' } })
  .then(res => res.text())
  .then(text => console.log("Success:", text))
  .catch(console.error);

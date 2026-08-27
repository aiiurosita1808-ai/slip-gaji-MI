import fetch from 'node-fetch';

const binId = 'slip' + Date.now();
const url = `https://filebin.net/${binId}/slip.pdf`;
const blob = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Title (Test PDF)\n>>\nendobj\n%EOF\n');
await fetch(url, { method: 'POST', body: blob, headers: { 'Content-Type': 'text/plain' } });

console.log("Uploaded to", url);

const token = "Fj34XJCidbFweDCyv65z";
import FormData from 'form-data';
const formData = new FormData();
formData.append('target', '085718717833');
formData.append('message', 'Test filebin pdf plain');
formData.append('url', url);

const res = await fetch('https://api.fonnte.com/send', {
  method: 'POST',
  headers: {
    'Authorization': token,
    ...formData.getHeaders()
  },
  body: formData
});
const data = await res.json();
console.log("Fonnte:", data);

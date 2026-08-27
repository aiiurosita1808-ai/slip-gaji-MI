import fetch from 'node-fetch';
import fs from 'fs';

async function run() {
  const binId = 'testbin' + Date.now();
  const filename = 'slip.pdf';
  const url = `https://filebin.net/${binId}/${filename}`;
  
  const res = await fetch(url, {
    method: 'POST',
    body: Buffer.from('hello world pdf', 'utf8'),
    headers: { 'Content-Type': 'application/pdf' }
  });
  
  if (res.ok) {
    console.log("Success! Download URL:", url);
    const dl = await fetch(url);
    console.log("Downloaded text:", await dl.text());
  } else {
    console.log("Failed:", res.status);
  }
}
run();

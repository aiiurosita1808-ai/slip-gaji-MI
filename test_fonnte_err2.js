import fetch from 'node-fetch';

async function test() {
  const urlencoded = new URLSearchParams();
  urlencoded.append("target", "081234567890");
  urlencoded.append("message", "test message");
  urlencoded.append("schedule", "2026-10-10 10:10:10");

  const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
          'Authorization': 'invalid'
      },
      body: urlencoded
  });
  console.log(await res.text());
}
test();

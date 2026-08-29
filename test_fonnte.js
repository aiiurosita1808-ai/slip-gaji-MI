const fetch = require('node-fetch');
async function test() {
  const fd = new URLSearchParams();
  fd.append('target', '081234567890');
  fd.append('message', 'test');
  
  const res = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { 'Authorization': 'test' },
    body: fd
  });
  console.log(await res.text());
}
test();

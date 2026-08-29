import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function testCatbox() {
  try {
    const fd = new FormData();
    fd.append('reqtype', 'fileupload');
    fd.append('time', '1h');
    fd.append('fileToUpload', fs.createReadStream('package.json'));
    
    const res = await fetch('https://litterbox.catbox.moe/user/api.php', {
      method: 'POST',
      body: fd,
      headers: { 'Origin': 'https://slipgajimialbarokah.netlify.app' }
    });
    console.log("Catbox status:", res.status);
    console.log("Catbox CORS origin:", res.headers.get('access-control-allow-origin'));
    const text = await res.text();
    console.log("Catbox response:", text);
  } catch (e) { console.error("Catbox error:", e.message); }
}
testCatbox();

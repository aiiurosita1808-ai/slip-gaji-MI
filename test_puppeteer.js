const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
    <script>
    async function test() {
      const fd = new FormData();
      fd.append('target', '081234567890');
      fd.append('message', 'test');
      try {
        const res = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: { 'Authorization': 'test' },
          body: fd
        });
        console.log("FormData:", await res.text());
      } catch(e) { console.log("FormData Error:", e); }

      const urlp = new URLSearchParams();
      urlp.append('target', '081234567890');
      urlp.append('message', 'test');
      try {
        const res2 = await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: { 'Authorization': 'test' },
          body: urlp
        });
        console.log("URLSearchParams:", await res2.text());
      } catch(e) { console.log("URLSearchParams Error:", e); }
    }
    test();
    </script>
    </body>
    </html>
  `);
  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
})();

import fetch from 'node-fetch';

async function testFonnte() {
  const res = await fetch('https://api.fonnte.com/send', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://slipgajimialbarokah.netlify.app'
    }
  });
  console.log("CORS headers:", res.headers.get('access-control-allow-origin'));
}
testFonnte();

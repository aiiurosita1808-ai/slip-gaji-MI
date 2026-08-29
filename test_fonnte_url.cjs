const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
async function test() {
  const urlencoded = new URLSearchParams();
  urlencoded.append('target', '081234567890');
  urlencoded.append('message', 'test');
  
  const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
          'Authorization': 'test'
      },
      body: urlencoded
  });
  console.log('Response:', await response.text());
}
test();

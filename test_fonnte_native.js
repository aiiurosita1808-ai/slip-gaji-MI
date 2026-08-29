async function test() {
  const fd = new URLSearchParams();
  fd.append('target', '081234567890');
  fd.append('message', 'test');
  
  const res = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { 'Authorization': 'test' },
    body: fd
  });
  console.log('URLSearchParams:', await res.text());

  const fd2 = new FormData();
  fd2.append('target', '081234567890');
  fd2.append('message', 'test');
  
  const res2 = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { 'Authorization': 'test' },
    body: fd2
  });
  console.log('FormData:', await res2.text());
}
test();

import fetch from 'node-fetch';
import FormData from 'form-data';

async function run() {
  const form = new FormData();
  form.append('file', Buffer.from('hello world'), { filename: 'test.pdf' });
  const res = await fetch('https://file.io/', { method: 'POST', body: form });
  const text = await res.text();
  console.log(text);
}
run();

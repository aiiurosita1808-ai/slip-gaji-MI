import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function run() {
  const form = new FormData();
  form.append('file', Buffer.from('hello world'), { filename: 'test.txt' });
  const res = await fetch('https://file.io', { method: 'POST', body: form });
  const data = await res.json();
  console.log(data);
}
run();

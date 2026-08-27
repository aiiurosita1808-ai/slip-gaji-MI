import fetch from 'node-fetch';
import FormData from 'form-data';
const form = new FormData();
form.append('file', Buffer.from('hello pdf test'), { filename: 'test.pdf' });
fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: form })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);

import fetch from 'node-fetch';
import FormData from 'form-data';

async function test() {
  const fd = new FormData();
  fd.append('target', '081234567890');
  fd.append('message', 'test');
  
  // Notice we use node-fetch and form-data.
  // In the browser, native FormData is used.
}

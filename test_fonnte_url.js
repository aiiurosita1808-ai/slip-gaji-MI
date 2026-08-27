import fetch from 'node-fetch';
import FormData from 'form-data';

const token = "Fj34XJCidbFweDCyv65z";
// Minimal valid PDF
const pdfBase64 = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCj4+Cj4+CiAgL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iagoKNCAwIG9iago8PAogIC9UeXBlIC9Gb250CiAgL1N1YnR5cGUgL1R5cGUxCiAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgo+PgplbmRvYmoKCjUgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKNzAgNTAgVEQKL0YxIDEyIFRmCihIZWxsbywgV29ybGQhKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA3OSAwMDAwMCBuIAowMDAwMDAwMTczIDAwMDAwIG4gCjAwMDAwMDAzMDEgMDAwMDAgbiAKMDAwMDAwMDM5OCAwMDAwMCBuIAp0cmFpbGVyCjw8CiAgL1NpemUgNgogIC9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTIKJSVFT0YK";
const dataUri = `data:application/pdf;base64,${pdfBase64}`;

const formData = new FormData();
formData.append('target', '085718717833'); // Use a random dummy number or my own? Wait, Fonnte API doesn't validate number ownership. I'll use 08123456789. Wait, I shouldn't spam a real number. Let's send to 08000000000
formData.append('url', dataUri);
formData.append('message', 'Testing Fonnte data uri');

fetch('https://api.fonnte.com/send', {
  method: 'POST',
  headers: {
    'Authorization': token,
    ...formData.getHeaders()
  },
  body: formData
}).then(res => res.text()).then(console.log).catch(console.error);

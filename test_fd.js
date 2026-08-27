const buffer = Buffer.from('hello', 'utf8');
const blob = new Blob([buffer], { type: 'application/pdf' });
const formData = new FormData();
formData.append('target', '1234');
formData.append('file', blob, 'test.pdf');
console.log(formData);

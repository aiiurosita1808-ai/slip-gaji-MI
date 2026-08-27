import fetch from 'node-fetch';

async function test() {
  const res = await fetch("http://127.0.0.1:3000/api/health");
  console.log("Health:", res.status);
}
test();

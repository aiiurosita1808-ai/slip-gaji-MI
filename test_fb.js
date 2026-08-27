import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query, orderBy } from 'firebase/firestore';

const app = initializeApp({
  projectId: "ai-studio-sistemslipgajigu-fbb4a0b3-ed5c-41b1-b954-125f4053f93e"
});
const db = getFirestore(app);

async function run() {
  const q = query(collection(db, 'scheduled_slips'), orderBy('createdAt', 'desc'), limit(1));
  const snap = await getDocs(q);
  snap.forEach(doc => {
    const data = doc.data();
    console.log("ID:", doc.id);
    console.log("Status:", data.status);
    console.log("Host:", data.host);
    console.log("Filename:", data.filename);
  });
  process.exit(0);
}
run();

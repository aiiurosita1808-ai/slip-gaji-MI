import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query, orderBy } from 'firebase/firestore';

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

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

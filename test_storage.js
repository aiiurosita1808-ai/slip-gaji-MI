import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

async function run() {
  try {
    const storageRef = ref(storage, 'test.txt');
    await uploadString(storageRef, 'hello world');
    const url = await getDownloadURL(storageRef);
    console.log("Success URL:", url);
  } catch (e) {
    console.error("Failed:", e.message);
  }
  process.exit(0);
}
run();

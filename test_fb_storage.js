import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
// Ensure storage bucket is present
if (!firebaseConfig.storageBucket) {
  firebaseConfig.storageBucket = firebaseConfig.projectId + '.appspot.com';
  // or sometimes .firebasestorage.app
}
console.log("Storage bucket:", firebaseConfig.storageBucket);

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, 'test.txt');

async function testStorage() {
  try {
    await uploadString(storageRef, 'Hello World', 'raw', { contentType: 'text/plain' });
    const url = await getDownloadURL(storageRef);
    console.log("Success! URL:", url);
  } catch (e) {
    console.error("Storage error:", e);
  }
}
testStorage();

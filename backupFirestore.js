const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-service.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function backupCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const filePath = path.join(__dirname, 'backups', `${collectionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`Backed up ${collectionName} to ${filePath}`);
}

async function backupFirestore() {
  const collections = ['addresses', 'users']; // Add your collection names here
  for (const collectionName of collections) {
    await backupCollection(collectionName);
  }
}

backupFirestore().then(() => {
  console.log('Backup completed successfully');
}).catch(error => {
  console.error('Error during backup:', error);
});

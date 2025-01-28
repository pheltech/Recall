const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from firebase.env
require('dotenv').config({ path: './firebase.env' });

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: "https://country-place-recall.firebaseio.com"
});

const db = admin.firestore();

// Define an endpoint to fetch data from Firestore
app.get('/api/addresses', async (req, res) => {
  try {
    const addressesSnapshot = await db.collection('addresses').get();
    const addresses = [];
    addressesSnapshot.forEach(doc => {
      addresses.push({ id: doc.id, ...doc.data() });
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

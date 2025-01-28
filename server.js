<<<<<<< HEAD
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
=======
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Load environment variables from .env
require('dotenv').config();

console.log('Supabase URL:', process.env.SUPABASE_URL); // Debugging line
console.log('Supabase Key:', process.env.SUPABASE_KEY); // Debugging line

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is not defined in .env file');
}
const supabase = createClient(supabaseUrl, supabaseKey);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define an endpoint to fetch data from Supabase
app.get('/api/addresses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*');
    if (error) throw error;
    res.json(data);
>>>>>>> heroku/main
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

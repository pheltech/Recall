/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Function to retrieve Firebase config
exports.getFirebaseConfig = functions.https.onRequest((req, res) => {
  res.json({
    apiKey: functions.config().custom.firebase.api_key,
    authDomain: functions.config().custom.firebase.auth_domain,
    projectId: functions.config().custom.firebase.project_id,
    storageBucket: functions.config().custom.firebase.storage_bucket,
    messagingSenderId: functions.config().custom.firebase.messaging_sender_id,
    appId: functions.config().custom.firebase.app_id,
    measurementId: functions.config().custom.firebase.measurement_id
  });
});

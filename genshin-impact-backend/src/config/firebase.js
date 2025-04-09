const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

// Initialize Firebase Admin using env variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = getAuth();

module.exports = { admin, auth };

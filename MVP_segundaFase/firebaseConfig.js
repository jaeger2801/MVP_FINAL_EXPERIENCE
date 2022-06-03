const {initializeApp,cert} = require('firebase-admin/app');

const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

//----------------------------- Create your Private Key
const serviceAccount = require('./ooh-interactive-firebase-adminsdk-btbd0-199686751f.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;
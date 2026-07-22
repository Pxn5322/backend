import { initializeApp, getApps, cert } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

const required = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

export const adminAuth = getAuth();
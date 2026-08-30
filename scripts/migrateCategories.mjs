import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import serviceAccount from "../serviceKey.json" with {
    type: "json",
};


// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Read db.json
const dbPath = path.join(__dirname, "../db.json");

const data = JSON.parse(
    fs.readFileSync(dbPath, "utf-8")
);

const categories = data.categories || [];


// Initialize Firebase Admin
initializeApp({
    credential: cert(serviceAccount),
});


// Firestore
const db = getFirestore();


// Migration
const migrateCategories = async () => {
    try {
        console.log(`Found ${categories.length} categories`);

        for (const category of categories) {
            const categoryRef = db
                .collection("categories")
                .doc(String(category.id));

            await categoryRef.set({ name: category.name, description: category.description, isActive: Boolean(category.isActive), createdAt: category.createdAt, });

            console.log(
                `Added: ${category.id} - ${category.name}`
            );
        }

        console.log("\nCategories migration completed successfully!");
    } catch (error) {
        console.error("\nMigration failed:");
        console.error(error);
    }
};

migrateCategories();

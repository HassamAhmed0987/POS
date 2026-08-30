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

const products = data.products || [];


// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});


// Firestore
const db = getFirestore();


// Migration
const migrateProducts = async () => {
  try {
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      const productRef = db
        .collection("products")
        .doc(product.id);

      await productRef.set({
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        price: Number(product.price),
        image: product.image,
        stock: Number(product.stock),
        isAvailable: Boolean(product.isAvailable),
        createdAt: product.createdAt,
      });

      console.log(
        `Added: ${product.id} - ${product.name}`
      );
    }

    console.log("\nProducts migration completed successfully!");
  } catch (error) {
    console.error("\nMigration failed:");
    console.error(error);
  }
};

migrateProducts();
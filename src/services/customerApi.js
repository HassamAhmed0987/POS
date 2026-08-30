import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firbase";

const customersRef = collection(db, "customers");

export const customerApi = {
  // Get all customers
  getAll: async (params = {}) => {
    let customerQuery = customersRef;

    if (params.type) {
      customerQuery = query(
        customersRef,
        where("type", "==", params.type)
      );
    }

    const snapshot = await getDocs(customerQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get single customer
  getById: async (id) => {
    const customerRef = doc(db, "customers", id);
    const snapshot = await getDoc(customerRef);

    if (!snapshot.exists()) {
      throw new Error("Customer not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },

  // Create customer
  create: async (customerData) => {
    const docRef = await addDoc(customersRef, customerData);

    return {
      id: docRef.id,
      ...customerData,
    };
  },

  // Update complete customer
  update: async (id, customerData) => {
    const customerRef = doc(db, "customers", id);

    await updateDoc(customerRef, customerData);

    return {
      id,
      ...customerData,
    };
  },

  // Partial update
  patch: async (id, partialData) => {
    const customerRef = doc(db, "customers", id);

    await updateDoc(customerRef, partialData);

    return {
      id,
      ...partialData,
    };
  },

  // Delete customer
  delete: async (id) => {
    const customerRef = doc(db, "customers", id);

    await deleteDoc(customerRef);

    return { id };
  },
};


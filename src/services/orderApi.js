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

const ordersRef = collection(db, "orders");

export const orderApi = {
  // Get all orders
  getAll: async (params = {}) => {
    let orderQuery = ordersRef;

    if (params.status) {
      orderQuery = query(
        ordersRef,
        where("status", "==", params.status)
      );
    }

    if (params.paymentStatus) {
      orderQuery = query(
        ordersRef,
        where("paymentStatus", "==", params.paymentStatus)
      );
    }

    const snapshot = await getDocs(orderQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get single order
  getById: async (id) => {
    const orderRef = doc(db, "orders", id);
    const snapshot = await getDoc(orderRef);

    if (!snapshot.exists()) {
      throw new Error("Order not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },

  // Create order
  create: async (orderData) => {
    const docRef = await addDoc(ordersRef, orderData);

    return {
      id: docRef.id,
      ...orderData,
    };
  },

  // Update complete order
  update: async (id, orderData) => {
    const orderRef = doc(db, "orders", id);

    await updateDoc(orderRef, orderData);

    return {
      id,
      ...orderData,
    };
  },

  // Partial update
  patch: async (id, partialData) => {
    const orderRef = doc(db, "orders", id);

    await updateDoc(orderRef, partialData);

    return {
      id,
      ...partialData,
    };
  },

  // Delete order
  delete: async (id) => {
    const orderRef = doc(db, "orders", id);

    await deleteDoc(orderRef);

    return { id };
  },
};

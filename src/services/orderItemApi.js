import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firbase";

const orderItemsRef = collection(db, "orderItems");

export const orderItemApi = {
  // Get all order items
  getAll: async () => {
    const snapshot = await getDocs(orderItemsRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get items by order ID
  getByOrderId: async (orderId) => {
    const q = query(
      orderItemsRef,
      where("orderId", "==", orderId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get single order item
  getById: async (id) => {
    const itemRef = doc(db, "orderItems", id);

    const snapshot = await getDoc(itemRef);

    if (!snapshot.exists()) {
      throw new Error("Order item not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },

  // Create order item
  create: async (itemData) => {
    const docRef = await addDoc(
      orderItemsRef,
      itemData
    );

    return {
      id: docRef.id,
      ...itemData,
    };
  },

  // Delete order item
  delete: async (id) => {
    const itemRef = doc(db, "orderItems", id);

    await deleteDoc(itemRef);

    return { id };
  },
};

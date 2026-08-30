// import api from "./axios";

// export const productApi = {
//   getAll: async (params) => {
//     const response = await api.get("/products", { params });
//     return response.data;
//   },
//   getById: async (id) => {
//     const response = await api.get(`/products/${id}`);
//     return response.data;
//   },
//   create: async (productData) => {
//     const response = await api.post("/products", productData);
//     return response.data;
//   },
//   update: async (id, productData) => {
//     const response = await api.put(`/products/${id}`, productData);
//     return response.data;
//   },
//   patch: async (id, partialData) => {
//     const response = await api.patch(`/products/${id}`, partialData);
//     return response.data;
//   },
//   delete: async (id) => {
//     const response = await api.delete(`/products/${id}`);
//     return response.data;
//   },
// };

import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firbase";

const productsCollection = collection(db, "products");

export const productApi = {
  getAll: async () => {
    const snapshot = await getDocs(productsCollection);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  },

  getById: async (id) => {
    const productRef = doc(db, "products", id);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      throw new Error("Product not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },

  create: async (productData) => {
    const docRef = await addDoc(productsCollection, productData);

    return {
      id: docRef.id,
      ...productData,
    };
  },

  update: async (id, productData) => {
    const productRef = doc(db, "products", id);

    await updateDoc(productRef, productData);

    return {
      id,
      ...productData,
    };
  },

  patch: async (id, partialData) => {
    const productRef = doc(db, "products", id);

    await updateDoc(productRef, partialData);

    return {
      id,
      ...partialData,
    };
  },

  delete: async (id) => {
    const productRef = doc(db, "products", id);

    await deleteDoc(productRef);

    return { id };
  },
};
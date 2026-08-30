// import api from "./axios";

// export const categoryApi = {
//   getAll: async (params) => {
//     const response = await api.get("/categories", { params });
//     return response.data;
//   },
//   getById: async (id) => {
//     const response = await api.get(`/categories/${id}`);
//     return response.data;
//   },
//   create: async (categoryData) => {
//     const response = await api.post("/categories", categoryData);
//     return response.data;
//   },
//   update: async (id, categoryData) => {
//     const response = await api.put(`/categories/${id}`, categoryData);
//     return response.data;
//   },
//   patch: async (id, partialData) => {
//     const response = await api.patch(`/categories/${id}`, partialData);
//     return response.data;
//   },
//   delete: async (id) => {
//     const response = await api.delete(`/categories/${id}`);
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

const categoriesCollection = collection(db, "categories");

export const categoryApi = {
  // Get all categories
  getAll: async () => {
    const snapshot = await getDocs(categoriesCollection);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  },

  // Get single category
  getById: async (id) => {
    const categoryRef = doc(db, "categories", id);
    const snapshot = await getDoc(categoryRef);

    if (!snapshot.exists()) {
      throw new Error("Category not found");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },

  // Create category
  create: async (categoryData) => {
    const docRef = await addDoc(
      categoriesCollection,
      categoryData
    );

    return {
      id: docRef.id,
      ...categoryData,
    };
  },

  // Update category
  update: async (id, categoryData) => {
    const categoryRef = doc(db, "categories", id);

    await updateDoc(categoryRef, categoryData);

    return {
      id,
      ...categoryData,
    };
  },

  // Partial update
  patch: async (id, partialData) => {
    const categoryRef = doc(db, "categories", id);

    await updateDoc(categoryRef, partialData);

    return {
      id,
      ...partialData,
    };
  },

  // Delete category
  delete: async (id) => {
    const categoryRef = doc(db, "categories", id);

    await deleteDoc(categoryRef);

    return { id };
  },
};
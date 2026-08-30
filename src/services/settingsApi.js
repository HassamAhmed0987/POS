
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firbase";

const settingsRef = doc(db, "settings", "restaurant");

export const settingsApi = {
  // Get restaurant settings
  get: async () => {
    const snapshot = await getDoc(settingsRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },

  // Update complete settings
  update: async (settingsData) => {
    await setDoc(settingsRef, settingsData);

    return {
      id: "restaurant",
      ...settingsData,
    };
  },

  // Update partial settings
  patch: async (partialData) => {
    await updateDoc(settingsRef, partialData);

    return {
      id: "restaurant",
      ...partialData,
    };
  },
};


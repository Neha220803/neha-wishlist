import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./config";

// Collection names
const COLLECTIONS = {
  WISHLIST: "wishlist-items",
  TRANSACTIONS: "transactions",
  MONEY: "money-data",
};

// ==================== WISHLIST OPERATIONS ====================

/**
 * Get all wishlist items
 */
export const getAllWishlistItems = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.WISHLIST),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting wishlist items:", error);
    throw error;
  }
};

/**
 * Get single wishlist item
 */
export const getWishlistItem = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.WISHLIST, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting wishlist item:", error);
    throw error;
  }
};

/**
 * Add new wishlist item
 */
export const addWishlistItem = async (itemData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.WISHLIST), {
      ...itemData,
      allocatedAmount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, ...itemData };
  } catch (error) {
    console.error("Error adding wishlist item:", error);
    throw error;
  }
};

/**
 * Update wishlist item
 */
export const updateWishlistItem = async (id, updates) => {
  try {
    const docRef = doc(db, COLLECTIONS.WISHLIST, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { id, ...updates };
  } catch (error) {
    console.error("Error updating wishlist item:", error);
    throw error;
  }
};

/**
 * Delete wishlist item
 */
export const deleteWishlistItem = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.WISHLIST, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    throw error;
  }
};

// ==================== TRANSACTION OPERATIONS ====================

/**
 * Get all transactions
 */
export const getAllTransactions = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
};

/**
 * Add new transaction
 */
export const addTransaction = async (transactionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TRANSACTIONS), {
      ...transactionData,
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, ...transactionData };
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

/**
 * Delete transaction
 */
export const deleteTransaction = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TRANSACTIONS, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// ==================== MONEY DATA OPERATIONS ====================

/**
 * Get money data
 */
export const getMoneyData = async () => {
  try {
    const docRef = doc(db, COLLECTIONS.MONEY, "current");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Initialize with default values if doesn't exist
      const defaultData = {
        totalLiquid: 0,
        totalNonLiquid: 0,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(docRef, defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Error getting money data:", error);
    throw error;
  }
};

/**
 * Update money data
 */
export const updateMoneyData = async (moneyData) => {
  try {
    const docRef = doc(db, COLLECTIONS.MONEY, "current");
    await updateDoc(docRef, {
      ...moneyData,
      updatedAt: serverTimestamp(),
    });

    return moneyData;
  } catch (error) {
    console.error("Error updating money data:", error);
    throw error;
  }
};

/**
 * Initialize money data document (run once)
 */
export const initializeMoneyData = async () => {
  try {
    const docRef = doc(db, COLLECTIONS.MONEY, "current");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await updateDoc(docRef, {
        totalLiquid: 0,
        totalNonLiquid: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Error initializing money data:", error);
    throw error;
  }
};

// ==================== ALLOCATION OPERATIONS ====================

/**
 * Allocate money to wishlist item
 */
export const allocateMoneyToItem = async (itemId, amount) => {
  try {
    const docRef = doc(db, COLLECTIONS.WISHLIST, itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentAmount = docSnap.data().allocatedAmount || 0;
      const newAmount = currentAmount + amount;

      await updateDoc(docRef, {
        allocatedAmount: newAmount,
        updatedAt: serverTimestamp(),
      });

      return { success: true, newAmount };
    } else {
      throw new Error("Item not found");
    }
  } catch (error) {
    console.error("Error allocating money:", error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get total allocated money across all items
 */
export const getTotalAllocated = async () => {
  try {
    const items = await getAllWishlistItems();
    return items.reduce((sum, item) => sum + (item.allocatedAmount || 0), 0);
  } catch (error) {
    console.error("Error calculating total allocated:", error);
    throw error;
  }
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (allocated, target) => {
  if (!target || target === 0) return 0;
  return Math.min((allocated / target) * 100, 100);
};

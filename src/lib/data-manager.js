import { STORAGE_KEYS } from "./constants";

// ==================== WISHLIST ITEMS ====================

export const getWishlistItems = () => {
  if (typeof window === "undefined") return [];
  const items = localStorage.getItem(STORAGE_KEYS.WISHLIST_ITEMS);
  return items ? JSON.parse(items) : [];
};

export const saveWishlistItems = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.WISHLIST_ITEMS, JSON.stringify(items));
};

export const addWishlistItem = (item) => {
  const items = getWishlistItems();
  const newItem = {
    id: Date.now().toString(),
    ...item,
    allocatedAmount: 0,
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveWishlistItems(items);
  return newItem;
};

export const updateWishlistItem = (id, updates) => {
  const items = getWishlistItems();
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    saveWishlistItems(items);
    return items[index];
  }
  return null;
};

export const deleteWishlistItem = (id) => {
  const items = getWishlistItems();
  const filtered = items.filter((item) => item.id !== id);
  saveWishlistItems(filtered);
  return filtered;
};

// ==================== TRANSACTIONS ====================

export const getTransactions = () => {
  if (typeof window === "undefined") return [];
  const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return transactions ? JSON.parse(transactions) : [];
};

export const saveTransactions = (transactions) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const addTransaction = (transaction) => {
  const transactions = getTransactions();
  const newTransaction = {
    id: Date.now().toString(),
    ...transaction,
    createdAt: new Date().toISOString(),
  };
  transactions.unshift(newTransaction); // Add to beginning
  saveTransactions(transactions);

  // Update money data
  updateMoneyData(transaction);

  return newTransaction;
};

export const deleteTransaction = (id) => {
  const transactions = getTransactions();
  const transaction = transactions.find((t) => t.id === id);

  if (transaction) {
    // Reverse the money update
    const reverseTransaction = {
      ...transaction,
      amount: -transaction.amount, // Reverse the amount
    };
    updateMoneyData(reverseTransaction);
  }

  const filtered = transactions.filter((t) => t.id !== id);
  saveTransactions(filtered);
  return filtered;
};

// ==================== MONEY DATA ====================

export const getMoneyData = () => {
  if (typeof window === "undefined") {
    return {
      totalLiquid: 0,
      totalNonLiquid: 0,
    };
  }
  const data = localStorage.getItem(STORAGE_KEYS.MONEY_DATA);
  return data
    ? JSON.parse(data)
    : {
        totalLiquid: 0,
        totalNonLiquid: 0,
      };
};

export const saveMoneyData = (data) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.MONEY_DATA, JSON.stringify(data));
};

export const updateMoneyData = (transaction) => {
  const moneyData = getMoneyData();

  if (transaction.moneyType === "liquid") {
    moneyData.totalLiquid += transaction.amount;
  } else if (transaction.moneyType === "non-liquid") {
    moneyData.totalNonLiquid += transaction.amount;
  }

  saveMoneyData(moneyData);
  return moneyData;
};

// ==================== ALLOCATION ====================

export const allocateMoneyToItem = (itemId, amount) => {
  const item = getWishlistItems().find((i) => i.id === itemId);
  if (!item) return null;

  const newAllocatedAmount = (item.allocatedAmount || 0) + amount;
  return updateWishlistItem(itemId, { allocatedAmount: newAllocatedAmount });
};

export const getTotalAllocated = () => {
  const items = getWishlistItems();
  return items.reduce((sum, item) => sum + (item.allocatedAmount || 0), 0);
};

export const getUnallocatedMoney = () => {
  const { totalLiquid, totalNonLiquid } = getMoneyData();
  const totalMoney = totalLiquid + totalNonLiquid;
  const allocated = getTotalAllocated();
  return totalMoney - allocated;
};

// ==================== UTILITY ====================

export const calculateProgress = (allocated, target) => {
  if (!target || target === 0) return 0;
  return Math.min((allocated / target) * 100, 100);
};

export const clearAllData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.WISHLIST_ITEMS);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.MONEY_DATA);
};

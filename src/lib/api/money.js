// Client-side API functions for money and allocation operations

/**
 * Get money data with all calculations
 * Returns: totalLiquid, totalNonLiquid, totalMoney, totalAllocated, unallocated
 */
export const getMoneyData = async () => {
  try {
    const response = await fetch("/api/money");
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch money data");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching money data:", error);
    throw error;
  }
};

/**
 * Get total allocated money across all items
 */
export const getTotalAllocated = async () => {
  try {
    const moneyData = await getMoneyData();
    return moneyData.totalAllocated || 0;
  } catch (error) {
    console.error("Error getting total allocated:", error);
    throw error;
  }
};

/**
 * Get unallocated money
 */
export const getUnallocatedMoney = async () => {
  try {
    const moneyData = await getMoneyData();
    return moneyData.unallocated || 0;
  } catch (error) {
    console.error("Error getting unallocated money:", error);
    throw error;
  }
};

/**
 * Allocate money to wishlist items
 * @param {Object} allocations - Object with itemId as key and amount as value
 * Example: { "item1": 100, "item2": 200 }
 */
export const allocateMoneyToItems = async (allocations) => {
  try {
    const response = await fetch("/api/allocate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ allocations }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to allocate money");
    }

    return data.data;
  } catch (error) {
    console.error("Error allocating money:", error);
    throw error;
  }
};

/**
 * Allocate money to a single item
 */
export const allocateMoneyToItem = async (itemId, amount) => {
  try {
    const allocations = { [itemId]: amount };
    return await allocateMoneyToItems(allocations);
  } catch (error) {
    console.error("Error allocating money to item:", error);
    throw error;
  }
};

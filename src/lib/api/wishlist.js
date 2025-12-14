// Client-side API functions for wishlist operations

/**
 * Get all wishlist items
 */
export const getWishlistItems = async () => {
  try {
    const response = await fetch("/api/wishlist");
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch wishlist items");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    throw error;
  }
};

/**
 * Get single wishlist item
 */
export const getWishlistItem = async (id) => {
  try {
    const response = await fetch(`/api/wishlist/${id}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch wishlist item");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching wishlist item:", error);
    throw error;
  }
};

/**
 * Add new wishlist item
 */
export const addWishlistItem = async (itemData) => {
  try {
    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to add wishlist item");
    }

    return data.data;
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
    const response = await fetch(`/api/wishlist/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to update wishlist item");
    }

    return data.data;
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
    const response = await fetch(`/api/wishlist/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to delete wishlist item");
    }

    return data;
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
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

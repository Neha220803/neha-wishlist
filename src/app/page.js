"use client";

import { useState, useEffect } from "react";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { SearchBar } from "@/components/shared/SearchBar";
import { WishlistCard } from "@/components/wishlist/WishlistCard";
import { AddItemDialog } from "@/components/wishlist/AddItemDialog";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { getWishlistItems } from "@/lib/api/wishlist";
import { getMoneyData } from "@/lib/api/money";
import { Navbar } from "@/components/custom/NavBar";

export default function Home() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [moneyData, setMoneyData] = useState({
    totalLiquid: 0,
    totalNonLiquid: 0,
    totalAllocated: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priority: "all",
    category: "all",
    sortBy: "date",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Apply filters whenever items, search, or filters change
  useEffect(() => {
    applyFilters();
  }, [wishlistItems, searchTerm, filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [items, money] = await Promise.all([
        getWishlistItems(),
        getMoneyData(),
      ]);

      setWishlistItems(items);
      setMoneyData({
        totalLiquid: money.totalLiquid || 0,
        totalNonLiquid: money.totalNonLiquid || 0,
        totalAllocated: money.totalAllocated || 0,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...wishlistItems];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          (item.notes && item.notes.toLowerCase().includes(term)) ||
          (item.category && item.category.toLowerCase().includes(term))
      );
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter((item) => item.priority === filters.priority);
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Sorting
    switch (filters.sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        filtered.sort((a, b) => a.targetPrice - b.targetPrice);
        break;
      case "progress":
        filtered.sort((a, b) => {
          const progressA = ((a.allocatedAmount || 0) / a.targetPrice) * 100;
          const progressB = ((b.allocatedAmount || 0) / b.targetPrice) * 100;
          return progressB - progressA;
        });
        break;
      case "date":
      default:
        filtered.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        break;
    }

    setFilteredItems(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleUpdate = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onUpdate={handleUpdate} />
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your wishlist...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onUpdate={handleUpdate} />

      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Money Display Cards */}
        <div className="mb-8">
          <MoneyDisplay
            moneyData={moneyData}
            allocatedAmount={moneyData.totalAllocated}
          />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">My Wishlist</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Add Item Button - Desktop */}
          <AddItemDialog
            onItemAdded={handleUpdate}
            trigger={
              <Button size="lg" className="gap-2 hidden sm:flex">
                <Plus className="w-5 h-5" />
                Add Item
              </Button>
            }
          />
        </div>

        {/* Wishlist Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <WishlistCard key={item.id} item={item} onUpdate={handleUpdate} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-6 rounded-full bg-muted/50 mb-6">
              <Package className="w-16 h-16 text-muted-foreground" />
            </div>

            {searchTerm ||
            filters.priority !== "all" ||
            filters.category !== "all" ? (
              // No results from search/filter
              <>
                <h3 className="text-xl font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  No wishlist items match your current filters. Try adjusting
                  your search or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      priority: "all",
                      category: "all",
                      sortBy: "date",
                    });
                  }}
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              // Empty wishlist
              <>
                <h3 className="text-xl font-semibold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start adding items you want to save for. Set goals, track
                  progress, and achieve your dreams!
                </p>
                <AddItemDialog
                  onItemAdded={handleUpdate}
                  trigger={
                    <Button size="lg" className="gap-2">
                      <Plus className="w-5 h-5" />
                      Add Your First Item
                    </Button>
                  }
                />
              </>
            )}
          </div>
        )}

        {/* Mobile Floating Action Button */}
        <div className="fixed bottom-6 right-6 sm:hidden">
          <AddItemDialog
            onItemAdded={handleUpdate}
            trigger={
              <Button
                size="lg"
                className="rounded-full shadow-lg w-14 h-14 p-0"
              >
                <Plus className="w-6 h-6" />
              </Button>
            }
          />
        </div>
      </main>
    </div>
  );
}

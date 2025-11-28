"use client";

import { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRIORITY_LEVELS, CATEGORIES } from "@/lib/constants";

export function SearchBar({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priority: "all",
    category: "all",
    sortBy: "date", // date, price, progress, name
  });

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const hasActiveFilters =
    filters.priority !== "all" ||
    filters.category !== "all" ||
    filters.sortBy !== "date";

  const clearFilters = () => {
    setFilters({
      priority: "all",
      category: "all",
      sortBy: "date",
    });
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your wishlist..."
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant={showFilters ? "default" : "outline"}
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="w-5 h-5" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-card animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm">Filters & Sorting</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              >
                <option value="all">All Priorities</option>
                <option value={PRIORITY_LEVELS.HIGH}>High</option>
                <option value={PRIORITY_LEVELS.MEDIUM}>Medium</option>
                <option value={PRIORITY_LEVELS.LOW}>Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
              >
                <option value="date">Date Added</option>
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
                <option value="progress">Progress (%)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

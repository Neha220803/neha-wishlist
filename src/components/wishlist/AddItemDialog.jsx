"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { addWishlistItem } from "@/lib/api/wishlist";
import { PRIORITY_LEVELS, CATEGORIES } from "@/lib/constants";

const EMOJI_OPTIONS = [
  "💻",
  "📱",
  "🎮",
  "📷",
  "⌚",
  "🎧",
  "🖥️",
  "⌨️",
  "👕",
  "👔",
  "👗",
  "👟",
  "👜",
  "🕶️",
  "💍",
  "👒",
  "✈️",
  "🏖️",
  "🗺️",
  "🎒",
  "🏕️",
  "🚗",
  "🏠",
  "🛋️",
  "📚",
  "🎨",
  "🎸",
  "🎹",
  "🎤",
  "🎬",
  "📸",
  "🎯",
];

export function AddItemDialog({ onItemAdded, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "🎯",
    targetPrice: "",
    priority: PRIORITY_LEVELS.MEDIUM,
    category: CATEGORIES[0],
    notes: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter an item name");
      return;
    }

    const price = parseFloat(formData.targetPrice);
    if (!price || price <= 0) {
      alert("Please enter a valid target price");
      return;
    }

    setIsSubmitting(true);

    try {
      const newItem = {
        name: formData.name.trim(),
        icon: formData.icon,
        targetPrice: price,
        priority: formData.priority,
        category: formData.category,
        notes: formData.notes.trim(),
      };

      await addWishlistItem(newItem);

      // Reset form
      setFormData({
        name: "",
        icon: "🎯",
        targetPrice: "",
        priority: PRIORITY_LEVELS.MEDIUM,
        category: CATEGORIES[0],
        notes: "",
      });
      setIsOpen(false);

      if (onItemAdded) {
        onItemAdded();
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      icon: "🎯",
      targetPrice: "",
      priority: PRIORITY_LEVELS.MEDIUM,
      category: CATEGORIES[0],
      notes: "",
    });
    setShowEmojiPicker(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Add Wishlist Item
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Wishlist Item</DialogTitle>
            <DialogDescription>
              Add something you want to save money for
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Icon Picker */}
            <div>
              <label className="text-sm font-medium mb-2 block">Icon</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-5xl p-3 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors"
                >
                  {formData.icon}
                </button>
                <div className="flex-1 text-xs text-muted-foreground">
                  Click to choose an icon for your item
                </div>
              </div>

              {showEmojiPicker && (
                <div className="mt-3 p-3 border rounded-lg bg-muted/50 grid grid-cols-8 gap-2 max-h-40 overflow-y-auto">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        handleChange("icon", emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl p-2 hover:bg-background rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Item Name */}
            <div>
              <label htmlFor="name" className="text-sm font-medium mb-2 block">
                Item Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., MacBook Pro, New Shoes, Trip to Japan"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Target Price */}
            <div>
              <label
                htmlFor="targetPrice"
                className="text-sm font-medium mb-2 block"
              >
                Target Price ($) *
              </label>
              <input
                id="targetPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.targetPrice}
                onChange={(e) => handleChange("targetPrice", e.target.value)}
                placeholder="0.00"
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-medium mb-2 block"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="text-sm font-medium mb-2 block"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value={PRIORITY_LEVELS.LOW}>Low</option>
                  <option value={PRIORITY_LEVELS.MEDIUM}>Medium</option>
                  <option value={PRIORITY_LEVELS.HIGH}>High</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="text-sm font-medium mb-2 block">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any additional details about this item..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

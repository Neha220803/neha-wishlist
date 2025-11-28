"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { updateWishlistItem, deleteWishlistItem } from "@/lib/data-manager";
import { PRIORITY_LEVELS, CATEGORIES } from "@/lib/constants";
import { PinVerification } from "@/components/shared/PinVerification";

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

export function EditItemDialog({ item, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "🎯",
    targetPrice: "",
    priority: PRIORITY_LEVELS.MEDIUM,
    category: CATEGORIES[0],
    notes: "",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDeletePin, setShowDeletePin] = useState(false);
  const [showSavePin, setShowSavePin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);

  // Load item data when dialog opens
  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        name: item.name,
        icon: item.icon,
        targetPrice: item.targetPrice.toString(),
        priority: item.priority || PRIORITY_LEVELS.MEDIUM,
        category: item.category || CATEGORIES[0],
        notes: item.notes || "",
      });
    }
  }, [isOpen, item]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
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

    // Store changes and show PIN
    setPendingChanges({
      name: formData.name.trim(),
      icon: formData.icon,
      targetPrice: price,
      priority: formData.priority,
      category: formData.category,
      notes: formData.notes.trim(),
    });
    setShowSavePin(true);
  };

  const handleSaveConfirm = () => {
    if (!pendingChanges) return;

    setIsSubmitting(true);
    updateWishlistItem(item.id, pendingChanges);
    setIsSubmitting(false);
    setPendingChanges(null);
    handleClose();

    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDeleteClick = () => {
    setShowDeletePin(true);
  };

  const handleDeleteConfirm = () => {
    deleteWishlistItem(item.id);
    handleClose();

    if (onUpdate) {
      onUpdate();
    }
  };

  const handleClose = () => {
    setShowEmojiPicker(false);
    setPendingChanges(null);
    onClose();
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Wishlist Item</DialogTitle>
              <DialogDescription>
                Make changes to your wishlist item
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Allocated Amount Info */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  Current Savings
                </div>
                <div className="text-lg font-bold text-primary">
                  ${(item.allocatedAmount || 0).toFixed(2)}
                </div>
              </div>

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
                    Click to choose a different icon
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
                <label
                  htmlFor="edit-name"
                  className="text-sm font-medium mb-2 block"
                >
                  Item Name *
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., MacBook Pro, New Shoes"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              {/* Target Price */}
              <div>
                <label
                  htmlFor="edit-targetPrice"
                  className="text-sm font-medium mb-2 block"
                >
                  Target Price ($) *
                </label>
                <input
                  id="edit-targetPrice"
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
                    htmlFor="edit-category"
                    className="text-sm font-medium mb-2 block"
                  >
                    Category
                  </label>
                  <select
                    id="edit-category"
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
                    htmlFor="edit-priority"
                    className="text-sm font-medium mb-2 block"
                  >
                    Priority
                  </label>
                  <select
                    id="edit-priority"
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
                <label
                  htmlFor="edit-notes"
                  className="text-sm font-medium mb-2 block"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Any additional details..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                disabled={isSubmitting}
                className="gap-2 sm:mr-auto"
              >
                <Trash2 className="w-4 h-4" />
                Delete Item
              </Button>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* PIN for Save */}
      <PinVerification
        isOpen={showSavePin}
        onClose={() => {
          setShowSavePin(false);
          setPendingChanges(null);
        }}
        onSuccess={handleSaveConfirm}
        title="Confirm Changes"
        description="Enter your PIN to save changes"
      />

      {/* PIN for Delete */}
      <PinVerification
        isOpen={showDeletePin}
        onClose={() => setShowDeletePin(false)}
        onSuccess={handleDeleteConfirm}
        title="Delete Item"
        description="Enter your PIN to confirm deletion. This cannot be undone."
      />
    </>
  );
}

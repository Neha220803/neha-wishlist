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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { updateWishlistItem, deleteWishlistItem } from "@/lib/data-manager";
import { PRIORITY_LEVELS, CATEGORIES } from "@/lib/constants";
import { PinVerification } from "@/components/shared/PinVerification";
import { ScrollArea } from "../ui/scroll-area";

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
  const [showSavePin, setShowSavePin] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeletePin, setShowDeletePin] = useState(false);
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

  const handleClose = () => {
    setShowEmojiPicker(false);
    setShowEditDialog(false);
    setPendingChanges(null);
    onClose();
  };

  const handleSubmit = () => {
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

    updateWishlistItem(item.id, {
      name: formData.name.trim(),
      icon: formData.icon,
      targetPrice: price,
      priority: formData.priority,
      category: formData.category,
      notes: formData.notes.trim(),
    });

    setIsSubmitting(false);
    handleClose();

    if (onUpdate) {
      onUpdate();
    }
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

  if (!item) return null;

  return (
    <>
      {/* PIN Verification First */}
      <PinVerification
        isOpen={isOpen && !showEditDialog}
        onClose={onClose}
        onSuccess={() => setShowEditDialog(true)}
        title="Verify Identity"
        description="Enter your PIN to edit this item"
      />
      <Dialog open={showEditDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Wishlist Item</DialogTitle>
            <DialogDescription>
              Make changes to your wishlist item
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] px-6">
            <div className="space-y-4 py-4">
              {/* Allocated Amount Info */}
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  Current Savings
                </div>
                <div className="text-lg font-bold text-primary">
                  ₹{(item.allocatedAmount || 0).toFixed(2)}
                </div>
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-5xl h-auto p-3 border-2 border-dashed hover:border-primary"
                  >
                    {formData.icon}
                  </Button>
                  <div className="flex-1 text-xs text-muted-foreground">
                    Click to choose a different icon
                  </div>
                </div>

                {showEmojiPicker && (
                  <div className="mt-3 p-3 border rounded-lg bg-muted/50 grid grid-cols-8 gap-2 max-h-40 overflow-y-auto">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <Button
                        key={emoji}
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          handleChange("icon", emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-2xl h-auto p-2"
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Item Name *</Label>
                <Input
                  id="edit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., MacBook Pro, New Shoes"
                  required
                />
              </div>

              {/* Target Price */}
              <div className="space-y-2">
                <Label htmlFor="edit-targetPrice">Target Price (₹) *</Label>
                <Input
                  id="edit-targetPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.targetPrice}
                  onChange={(e) => handleChange("targetPrice", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleChange("priority", value)}
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PRIORITY_LEVELS.LOW}>Low</SelectItem>
                      <SelectItem value={PRIORITY_LEVELS.MEDIUM}>
                        Medium
                      </SelectItem>
                      <SelectItem value={PRIORITY_LEVELS.HIGH}>High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Any additional details..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </ScrollArea>
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
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
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

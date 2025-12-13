"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import { addWishlistItem } from "@/lib/data-manager";
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

export function AddItemDialog({ onItemAdded, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
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

    const newItem = {
      name: formData.name.trim(),
      icon: formData.icon,
      targetPrice: price,
      priority: formData.priority,
      category: formData.category,
      notes: formData.notes.trim(),
    };

    addWishlistItem(newItem);

    // Reset form
    setFormData({
      name: "",
      icon: "🎯",
      targetPrice: "",
      priority: PRIORITY_LEVELS.MEDIUM,
      category: CATEGORIES[0],
      notes: "",
    });
    setIsSubmitting(false);
    setShowEmojiPicker(false);
    setShowAddDialog(false);
    setIsOpen(false);

    if (onItemAdded) {
      onItemAdded();
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
    setShowAddDialog(false);
    setIsOpen(false);
  };

  const handleTriggerClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Trigger Button */}
      <div onClick={handleTriggerClick}>
        {trigger || (
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Add Wishlist Item
          </Button>
        )}
      </div>

      {/* PIN Verification First */}
      <PinVerification
        isOpen={isOpen && !showAddDialog}
        onClose={() => setIsOpen(false)}
        onSuccess={() => setShowAddDialog(true)}
        title="Verify Identity"
        description="Enter your PIN to add a new item"
      />

      {/* Add Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] p-0">
          <div className="p-6 pb-0">
            <DialogHeader>
              <DialogTitle>Add New Wishlist Item</DialogTitle>
              <DialogDescription>
                Add something you want to save money for
              </DialogDescription>
            </DialogHeader>
          </div>

          <ScrollArea className="max-h-[60vh] px-6">
            <div className="space-y-4 py-4">
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
                    Click to choose an icon for your item
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
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="e.g., MacBook Pro, New Shoes, Trip to Japan"
                  required
                />
              </div>

              {/* Target Price */}
              <div className="space-y-2">
                <Label htmlFor="targetPrice">Target Price (₹) *</Label>
                <Input
                  id="targetPrice"
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
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                  >
                    <SelectTrigger id="category">
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
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleChange("priority", value)}
                  >
                    <SelectTrigger id="priority">
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
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Any additional details about this item..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 pt-0">
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

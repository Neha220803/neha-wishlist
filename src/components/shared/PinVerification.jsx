"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CORRECT_PIN } from "@/lib/constants";
import { AlertCircle, Lock } from "lucide-react";

export function PinVerification({
  isOpen,
  onClose,
  onSuccess,
  title = "Enter PIN to Continue",
  description = "Enter your 4-digit PIN to authorize this action",
}) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;

    setPin(newPin);
    setError("");

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-verify when all 4 digits are entered
    if (index === 3 && value) {
      const enteredPin = [...newPin.slice(0, 3), value].join("");
      verifyPin(enteredPin);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);

    if (!/^\d+$/.test(pastedData)) return;

    const newPin = pastedData.split("");
    while (newPin.length < 4) newPin.push("");

    setPin(newPin);

    if (pastedData.length === 4) {
      verifyPin(pastedData);
    }
  };

  const verifyPin = (enteredPin) => {
    setIsVerifying(true);

    setTimeout(() => {
      if (enteredPin === CORRECT_PIN) {
        setError("");
        onSuccess();
        handleClose();
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin(["", "", "", ""]);
        setIsVerifying(false);
        // Focus first input
        document.getElementById("pin-0")?.focus();
      }
    }, 300); // Small delay for better UX
  };

  const handleClose = () => {
    setPin(["", "", "", ""]);
    setError("");
    setIsVerifying(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* PIN Input Boxes */}
          <div className="flex gap-3" onPaste={handlePaste}>
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying}
                className={`
                  w-14 h-14 text-center text-2xl font-bold rounded-lg border-2 
                  transition-all focus:outline-none focus:ring-2 focus:ring-primary
                  ${
                    error
                      ? "border-destructive bg-destructive/5"
                      : "border-border bg-background"
                  }
                  ${isVerifying ? "opacity-50 cursor-not-allowed" : ""}
                  ${digit ? "border-primary" : ""}
                `}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Verifying State */}
          {isVerifying && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Verifying...
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isVerifying}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

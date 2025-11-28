"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Receipt, Home, Plus, Wallet } from "lucide-react";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { AllocateMoneyDialog } from "@/components/transactions/AllocateMoneyDialog";
const imglogo = "/logo.png";
export function Navbar({ onUpdate }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl overflow-hidden mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <img
                  src={imglogo}
                  alt="Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Neha's Wishlist Tracker
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/">
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>

              <Link href="/transactions">
                <Button
                  variant={isActive("/transactions") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  Transactions
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Add Transaction Button */}
            <AddTransactionDialog
              onTransactionAdded={onUpdate}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hidden sm:flex"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden lg:inline">Add Transaction</span>
                </Button>
              }
            />

            {/* Allocate Money Button */}
            <AllocateMoneyDialog
              onAllocated={onUpdate}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hidden sm:flex"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden lg:inline">Allocate</span>
                </Button>
              }
            />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              className="rounded-lg"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto">
          <Link href="/" className="flex-shrink-0">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>

          <Link href="/transactions" className="flex-shrink-0">
            <Button
              variant={isActive("/transactions") ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Receipt className="w-4 h-4" />
              Transactions
            </Button>
          </Link>

          <AddTransactionDialog
            onTransactionAdded={onUpdate}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="gap-2 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            }
          />

          <AllocateMoneyDialog
            onAllocated={onUpdate}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="gap-2 flex-shrink-0"
              >
                <Wallet className="w-4 h-4" />
                Allocate
              </Button>
            }
          />
        </div>
      </div>
    </nav>
  );
}

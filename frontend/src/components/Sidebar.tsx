"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  LogOut,
  Scissors,
  Package,
  Calendar,
  Settings as SettingsIcon,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Clear any auth tokens here if needed
    router.push("/login");
  };

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/customers", icon: Users, label: "Customers" },
    { path: "/measurements", icon: Scissors, label: "Measurements" }, // New
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/appointments", icon: Calendar, label: "Appointments" }, // New
    { path: "/settings", icon: SettingsIcon, label: "Settings" }, // New
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
                fixed top-0 left-0 h-screen w-64 bg-indigo-950/95 backdrop-blur-xl text-white shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 border-r border-white/5
            `}
      >
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2.5 rounded-2xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
              <Scissors className="h-6 w-6 text-indigo-950" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-transparent">
              Tailors Hub
            </span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden text-indigo-200 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => {
                  // Close sidebar on mobile when link is clicked
                  if (window.innerWidth < 768) onClose();
                }}
                className={`flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-white/10 text-white shadow-lg border border-white/10"
                    : "text-indigo-200/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-indigo-400 group-hover:text-white"}`}
                />
                <span className="font-semibold tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-900/30 hover:text-red-100 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

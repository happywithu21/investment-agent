"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

interface ShellContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const ShellContext = createContext<ShellContextType>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export function useShell() {
  return useContext(ShellContext);
}

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ShellContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
      <div className="app-shell">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="main-area">
          <TopNav />
          <div className="page-content">
            {children}
          </div>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

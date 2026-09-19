import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';

interface AppShellProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  falkorConnected: boolean;
  onLaunchDemo: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  setActiveTab,
  falkorConnected,
  onLaunchDemo,
  children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-200 flex font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          falkorConnected={falkorConnected}
          onOpenCommandPalette={() => setIsCommandOpen(true)}
          onLaunchDemo={onLaunchDemo}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-5 overflow-y-auto bg-[#080a0f]">
          {children}
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={setActiveTab}
        onLaunchDemo={onLaunchDemo}
      />
    </div>
  );
};

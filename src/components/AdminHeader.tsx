import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, Menu } from 'lucide-react';

export default function AdminHeader({ setMobileOpen }: { setMobileOpen?: (open: boolean) => void }) {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-4 w-full md:w-1/3">
        {setMobileOpen && (
          <button 
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-secondary/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-border"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-border pl-6">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
            {user?.name.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name || 'Admin'}</p>
            <p className="text-xs text-muted-foreground mt-1">{user?.role || 'Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

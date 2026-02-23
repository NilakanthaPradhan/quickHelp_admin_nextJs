"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  MessageSquare, 
  ClipboardList, 
  LogOut,
  Home,
  X
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rentals", label: "Rentals", icon: Home },
  { href: "/requests", label: "Requests", icon: ClipboardList },
  { href: "/users", label: "Users", icon: Users },
  { href: "/providers", label: "Providers", icon: Users },
  { href: "/providers/add", label: "Add Provider", icon: UserPlus },
  { href: "/chat", label: "Support Chat", icon: MessageSquare },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed md:relative flex flex-col h-full w-[280px] md:w-64 bg-slate-900/95 md:bg-slate-900 text-white border-r border-slate-800 backdrop-blur-xl transition-transform duration-300 ease-in-out z-50 shadow-2xl md:shadow-none",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
            Q
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            QuickHelp
          </h1>
        </div>
        
        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-2 -mr-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-semibold" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 transition-opacity",
                isActive && "opacity-100"
              )} />
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
              
              <Icon size={20} className={cn("relative z-10 transition-transform duration-300 group-hover:scale-110", isActive && "text-blue-400")} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Administrator</p>
            <p className="text-xs text-slate-400 truncate">System Access</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

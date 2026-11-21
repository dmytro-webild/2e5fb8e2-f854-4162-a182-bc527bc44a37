import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  BookOpen,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react';
import type { ActiveTab } from '../../types/workspace';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentWorkspace: string;
  onSelectWorkspace: (ws: string) => void;
  notebooksCount: number;
  historyCount: number;
}

const WORKSPACES = [
  'Personal Workspace',
  'Engineering Team',
  'YouTube Studio Lab',
  'Stanford CS Lectures',
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  currentWorkspace,
  onSelectWorkspace,
  notebooksCount,
  historyCount,
}: SidebarProps) {
  const [isWsOpen, setIsWsOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  const navItems = [
    {
      id: 'dictate' as ActiveTab,
      label: 'Dictate / AI Studio',
      icon: Mic,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/15 text-emerald-700 font-semibold',
    },
    {
      id: 'notebooks' as ActiveTab,
      label: 'Notebooks',
      icon: BookOpen,
      count: notebooksCount,
    },
    {
      id: 'history' as ActiveTab,
      label: 'Dictation History',
      icon: History,
      count: historyCount,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-border/80 bg-card/60 backdrop-blur-xl transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Header & Workspace Switcher */}
      <div>
        <div className="flex items-center justify-between h-16 px-3.5 border-b border-border/60">
          {!isCollapsed ? (
            <div className="relative w-full">
              <button
                onClick={() => setIsWsOpen(!isWsOpen)}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm shrink-0 shadow-sm">
                    N
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Workspace</p>
                    <p className="text-sm font-semibold text-foreground truncate">{currentWorkspace}</p>
                  </div>
                </div>
                <ChevronDown className="size-4 text-muted-foreground shrink-0" />
              </button>

              {/* Workspace Dropdown */}
              {isWsOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 p-1 bg-card border border-border shadow-xl rounded-xl">
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Switch Workspace</p>
                  {WORKSPACES.map((ws) => (
                    <button
                      key={ws}
                      onClick={() => {
                        onSelectWorkspace(ws);
                        setIsWsOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-2.5 py-2 text-xs font-medium rounded-lg hover:bg-muted text-foreground"
                    >
                      <span className="truncate">{ws}</span>
                      {currentWorkspace === ws && <Check className="size-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center size-9 rounded-lg bg-primary text-primary-foreground font-bold text-base shadow-sm">
                N
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className={`size-4.5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 flex items-center justify-center size-6 rounded-full bg-card border border-border shadow-md text-muted-foreground hover:text-foreground transition-colors z-20"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </button>

      {/* Bottom User Account Card & Pro Upgrade */}
      <div className="p-3 border-t border-border/60">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs shrink-0">
                AM
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">Alex Morgan</p>
                <p className="text-[11px] text-muted-foreground truncate">alex@noteai.io</p>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent/20 text-foreground border border-accent/40">
                Free Tier
              </span>
            </div>

            <button
              onClick={() => setShowProModal(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-accent/20 hover:text-foreground transition-all cursor-pointer border border-border/60"
            >
              <Sparkles className="size-3.5 text-amber-500" />
              <span>Upgrade to Pro</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/15 text-amber-600 font-semibold uppercase">Soon</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setShowProModal(true)}
              title="Upgrade to Pro (Coming Soon)"
              className="size-9 rounded-full bg-accent/20 text-foreground flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Sparkles className="size-4 text-amber-500" />
            </button>
          </div>
        )}

        {/* Back to Home Landing link */}
        {!isCollapsed && (
          <Link
            to="/"
            className="flex items-center justify-between mt-2 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Landing Page</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
      </div>

      {/* Pro Modal Notice */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 bg-card border border-border rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <Sparkles className="size-6" />
              <h3 className="text-lg font-bold text-foreground">NoteAI Pro Membership</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stripe checkout integration is coming soon! Pro will unlock unlimited voice dictation, custom video OCR, team workspace sharing, and priority AI processing.
            </p>
            <div className="space-y-2 text-xs text-foreground">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                <span>Unlimited voice-to-text dictation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                <span>Custom YouTube & Course prompt templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-500" />
                <span>Full PDF & Markdown bulk exports</span>
              </div>
            </div>
            <button
              onClick={() => setShowProModal(false)}
              className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

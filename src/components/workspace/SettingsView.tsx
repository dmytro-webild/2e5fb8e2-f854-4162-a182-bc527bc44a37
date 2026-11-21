import { useState } from 'react';
import { Settings, Mic, Keyboard, Sparkles, Check } from 'lucide-react';
import type { WorkspaceSettings } from '../../types/workspace';

interface SettingsViewProps {
  settings: WorkspaceSettings;
  onUpdateSettings: (newSettings: WorkspaceSettings) => void;
}

export default function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key: keyof WorkspaceSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
    triggerSaved();
  };

  const handleSelect = <K extends keyof WorkspaceSettings>(key: K, val: WorkspaceSettings[K]) => {
    const updated = { ...settings, [key]: val };
    onUpdateSettings(updated);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 select-none overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <Settings className="size-6 text-primary" />
          <div>
            <h2 className="text-lg font-bold text-foreground">Workspace Preferences</h2>
            <p className="text-xs text-muted-foreground">Customize voice input, shortcuts, and AI polishing styles.</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">
            <Check className="size-3.5" />
            <span>Saved Preferences</span>
          </div>
        )}
      </div>

      {/* Section 1: Voice Input & Hardware */}
      <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Mic className="size-4 text-primary" />
          <h3>Voice Input & Microphone Settings</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-muted-foreground">Microphone Input Device</label>
            <select
              value={settings.micDeviceId}
              onChange={(e) => handleSelect('micDeviceId', e.target.value)}
              className="w-full mt-1.5 p-2.5 rounded-xl bg-muted border border-border text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="default">Default System Microphone (Internal / USB)</option>
              <option value="airpods">AirPods Pro / Wireless Headset</option>
              <option value="virtual">Virtual Audio Cable (Coursera / Zoom Capture)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold text-foreground">Automatic Filler Word Removal</p>
              <p className="text-muted-foreground">Strips out "um", "uh", "like", and "you know" from speech</p>
            </div>
            <button
              onClick={() => handleToggle('autoRemoveFillers')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.autoRemoveFillers ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${
                  settings.autoRemoveFillers ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Keyboard Shortcuts */}
      <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Keyboard className="size-4 text-primary" />
          <h3>Keyboard Shortcuts & Accessibility</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-foreground">Spacebar Recording Toggle</p>
              <p className="text-muted-foreground">Press Spacebar when focused in workspace to toggle start/stop</p>
            </div>
            <button
              onClick={() => handleToggle('spacebarShortcut')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.spacebarShortcut ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${
                  settings.spacebarShortcut ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold text-foreground">Alt + V Dictate Shortcut</p>
              <p className="text-muted-foreground">Global shortcut key combination to start dictating</p>
            </div>
            <button
              onClick={() => handleToggle('altVShortcut')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.altVShortcut ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${
                  settings.altVShortcut ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Screen Glow & Visual Effects */}
      <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Sparkles className="size-4 text-primary" />
          <h3>Siri / Circle-to-Search Screen Glow Transition</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-foreground">Enable Viewport Edge Glow Sweep</p>
              <p className="text-muted-foreground">Triggers 1.2s aura transition upon stopping recording</p>
            </div>
            <button
              onClick={() => handleToggle('glowEffectEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.glowEffectEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${
                  settings.glowEffectEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="font-semibold text-muted-foreground">Glow Aura Theme</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { id: 'siri', name: 'Siri Multi-Color', colors: 'from-cyan-400 via-purple-500 to-amber-400' },
                { id: 'amber', name: 'Cyber Amber', colors: 'from-amber-500 to-orange-500' },
                { id: 'violet', name: 'Subtle Violet', colors: 'from-violet-600 to-indigo-500' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleSelect('glowStyle', style.id as WorkspaceSettings['glowStyle'])}
                  className={`p-3 rounded-2xl border text-left space-y-1.5 transition-all ${
                    settings.glowStyle === style.id
                      ? 'bg-card border-primary ring-2 ring-primary/20 shadow-sm'
                      : 'bg-muted/40 border-border/60 hover:bg-muted'
                  }`}
                >
                  <div className={`h-2.5 rounded-full bg-gradient-to-r ${style.colors}`} />
                  <p className="font-bold text-foreground truncate">{style.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

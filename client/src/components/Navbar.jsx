import { LogOut, User, BookOpen, Brain, Home, CalendarDays, Menu, Sun, Moon, Heart } from 'lucide-react';
import { Button } from './ui/Button.jsx';
import { useTheme } from '../context/ThemeContext';
import { usePlanner } from "../features/daily-planner/context/PlannerContext.jsx";

export function Navbar({ currentPage, onNavigate, isLoggedIn, onLogout, userName, openPlanner }) {
  if (!isLoggedIn) return null;
  const { theme, toggleTheme } = useTheme();
  const { completedTasks, totalTasks, streak } = usePlanner();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', Icon: Home },
    { key: 'syllabus', label: 'Syllabus', Icon: BookOpen },
    { key: 'planner', label: 'Planner', Icon: CalendarDays },
    { key: 'ai-assistant', label: 'AI Assistant', Icon: Brain },
    { key: 'profile', label: 'Profile', Icon: User },
    { key: 'safe-space', label: 'Safe Space', Icon: Heart },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-foreground">EduTrack</h1>
            <div className="hidden md:flex gap-1">
              {navItems.map(({ key, label, Icon }) => (
                <Button
                  key={key}
                  variant={currentPage === key ? 'default' : 'ghost'}
                  onClick={() => onNavigate(key)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-muted text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <span className="hidden sm:block text-sm text-foreground">
              Welcome, <span className="font-semibold">{userName}</span>
            </span>
            <button
              onClick={openPlanner}
              className="hidden sm:flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              aria-label="Open daily planner"
            >
              <span>🔥{streak}</span>
              <span className="text-muted-foreground">📅({completedTasks}/{totalTasks})</span>
            </button>

            {/* Desktop/Tablet logout */}
            <Button variant="outline" onClick={onLogout} className="hidden md:inline-flex gap-2 border-border">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

            {/* Mobile hamburger */}
            <details className="relative md:hidden group">
              {/* Apply button styles directly to the summary tag! */}
              <summary className="list-none cursor-pointer flex items-center justify-center h-10 w-10 rounded-md border border-border bg-background hover:bg-muted transition-colors appearance-none marker:hidden">
                <Menu className="w-5 h-5 text-foreground" />
              </summary>
              
              <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card shadow-lg p-2">
                <div className="px-2 py-2">
                  <div className="text-sm text-muted-foreground">Signed in as</div>
                  <div className="font-semibold text-foreground truncate">{userName}</div>
                </div>

                <div className="h-px bg-border my-2" />

                <button
                  onClick={(e) => {
                    openPlanner();
                    e.currentTarget.closest('details').removeAttribute('open'); // Closes menu
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                >
                  <div className="text-sm font-medium">Daily planner</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    🔥{streak} · 📅 {completedTasks}/{totalTasks}
                  </div>
                </button>

                <div className="h-px bg-border my-2" />

                <div className="space-y-1">
                  {navItems.map(({ key, label, Icon }) => (
                    <Button
                      key={key}
                      variant={currentPage === key ? 'default' : 'ghost'}
                      onClick={(e) => {
                        onNavigate(key);
                        e.currentTarget.closest('details').removeAttribute('open'); // Closes menu
                      }}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Button>
                  ))}
                </div>

                <div className="h-px bg-border my-2" />

                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    onLogout();
                    e.currentTarget.closest('details').removeAttribute('open'); // Closes menu
                  }} 
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
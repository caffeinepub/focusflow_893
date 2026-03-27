import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BellOff,
  BookOpen,
  Brain,
  CalendarDays,
  CheckSquare,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LogIn,
  LogOut,
  Menu,
  Palette,
  Repeat2,
  Target,
  Timer,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, lazy, useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useReminders } from "./hooks/useReminders";
import { useTheme } from "./hooks/useTheme";

const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const FocusPage = lazy(() => import("./pages/FocusPage"));
const GoalsPage = lazy(() => import("./pages/GoalsPage"));
const HabitsPage = lazy(() => import("./pages/HabitsPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const JournalPage = lazy(() => import("./pages/JournalPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const StudyTrackerPage = lazy(() => import("./pages/StudyTrackerPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const TodoPage = lazy(() => import("./pages/TodoPage"));

// ─── Navigation config ─────────────────────────────────────────────────────

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard.link",
  },
  { to: "/tasks", label: "Tasks", icon: CheckSquare, ocid: "nav.tasks.link" },
  { to: "/todo", label: "To Do List", icon: ListChecks, ocid: "nav.todo.link" },
  {
    to: "/projects",
    label: "Projects",
    icon: FolderOpen,
    ocid: "nav.projects.link",
  },
  {
    to: "/study",
    label: "Study Tracker",
    icon: GraduationCap,
    ocid: "nav.study.link",
  },
  {
    to: "/goals",
    label: "Goals",
    icon: Target,
    ocid: "nav.goals.link",
  },
  {
    to: "/insights",
    label: "AI Insights",
    icon: Brain,
    ocid: "nav.insights.link",
  },
  {
    to: "/habits",
    label: "Habits",
    icon: Repeat2,
    ocid: "nav.habits.link",
  },
  {
    to: "/journal",
    label: "Journal",
    icon: BookOpen,
    ocid: "nav.journal.link",
  },
  { to: "/focus", label: "Focus Timer", icon: Timer, ocid: "nav.focus.link" },
  {
    to: "/calendar",
    label: "Calendar",
    icon: CalendarDays,
    ocid: "nav.calendar.link",
  },
  {
    to: "/reports",
    label: "Reports",
    icon: BarChart3,
    ocid: "nav.reports.link",
  },
] as const;

// ─── Sidebar ──────────────────────────────────────────────────────────────────────

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, toggleTheme } = useTheme();
  const { remindersEnabled, toggleReminders } = useReminders(isAuthenticated);

  const themeLabel =
    theme === "emerald"
      ? "Switch to Amber"
      : theme === "amber"
        ? "Switch to Light"
        : "Switch to Emerald";

  const themeDotColor =
    theme === "emerald"
      ? "oklch(0.72 0.19 156)"
      : theme === "amber"
        ? "oklch(0.78 0.19 75)"
        : "oklch(0.60 0.19 156)";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Timer className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            FocusFlow
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-3">
          Navigation
        </p>
        {navItems.map(({ to, label, icon: Icon, ocid }) => {
          const isActive =
            to === "/" ? currentPath === "/" : currentPath.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "sidebar-active font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Auth */}
      <div className="px-3 py-4 border-t border-border space-y-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={toggleTheme}
          data-ocid="theme.toggle_button"
        >
          <Palette className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="flex-1 text-left">{themeLabel}</span>
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: themeDotColor }}
          />
        </Button>

        {/* Reminders Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={toggleReminders}
          data-ocid="reminders.toggle_button"
        >
          {remindersEnabled ? (
            <Bell className="w-4 h-4 mr-2 flex-shrink-0" />
          ) : (
            <BellOff className="w-4 h-4 mr-2 flex-shrink-0" />
          )}
          <span className="flex-1 text-left">
            {remindersEnabled ? "Reminders On" : "Reminders Off"}
          </span>
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              remindersEnabled ? "bg-green-500" : "bg-muted-foreground/40"
            }`}
          />
        </Button>

        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {identity.getPrincipal().toString().slice(0, 10)}...
                </p>
                <p className="text-xs text-muted-foreground">Authenticated</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={clear}
              data-ocid="auth.logout_button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="auth.login_button"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoggingIn ? "Signing in..." : "Sign in"}
          </Button>
        )}
        <div className="px-3">
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors block text-center"
          >
            © {new Date().getFullYear()}. Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Layout ────────────────────────────────────────────────────────────────────────

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-50 lg:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Timer className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              FocusFlow
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={routerState.location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// ─── Router setup ────────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => {
    const { theme } = useTheme();
    return (
      <>
        <Layout />
        <Toaster
          theme={theme === "light" ? "light" : "dark"}
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "bg-card border-border text-foreground",
            },
          }}
        />
      </>
    );
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks",
  component: TasksPage,
});

const todoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/todo",
  component: TodoPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: ProjectsPage,
});

const studyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/study",
  component: StudyTrackerPage,
});

const goalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/goals",
  component: GoalsPage,
});

const habitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/habits",
  component: HabitsPage,
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/journal",
  component: JournalPage,
});

const focusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/focus",
  component: FocusPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarPage,
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/insights",
  component: InsightsPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  component: ReportsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tasksRoute,
  todoRoute,
  projectsRoute,
  studyRoute,
  goalsRoute,
  habitsRoute,
  journalRoute,
  focusRoute,
  calendarRoute,
  reportsRoute,
  insightsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

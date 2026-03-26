import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Filter,
  Flame,
  GraduationCap,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAllProjects, useAllTasks } from "../hooks/useQueries";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  date: string;
  linkedProjectId: string | null;
  linkedTaskId: string | null;
  notes: string;
}

interface StudyStreak {
  currentStreak: number;
  lastStudyDate: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_SESSIONS = "focusflow_study_sessions";
const LS_STREAK = "focusflow_study_streak";

const SUBJECT_COLORS = [
  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
];

function hashSubject(subject: string): number {
  let h = 0;
  for (let i = 0; i < subject.length; i++) {
    h = (h * 31 + subject.charCodeAt(i)) >>> 0;
  }
  return h % SUBJECT_COLORS.length;
}

function subjectColor(subject: string) {
  return SUBJECT_COLORS[hashSubject(subject)];
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function loadSessions(): StudySession[] {
  try {
    return JSON.parse(localStorage.getItem(LS_SESSIONS) ?? "[]");
  } catch {
    return [];
  }
}

function saveSessions(sessions: StudySession[]) {
  localStorage.setItem(LS_SESSIONS, JSON.stringify(sessions));
}

function loadStreak(): StudyStreak {
  try {
    return JSON.parse(
      localStorage.getItem(LS_STREAK) ??
        '{"currentStreak":0,"lastStudyDate":null}',
    );
  } catch {
    return { currentStreak: 0, lastStudyDate: null };
  }
}

function computeStreak(sessions: StudySession[]): StudyStreak {
  const studyDays = new Set(sessions.map((s) => s.date));
  if (studyDays.size === 0) return { currentStreak: 0, lastStudyDate: null };

  const sortedDays = Array.from(studyDays).sort().reverse();
  const today = todayISO();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (sortedDays[0] !== today && sortedDays[0] !== yesterday) {
    return { currentStreak: 0, lastStudyDate: sortedDays[0] };
  }

  let streak = 0;
  let checkDate = sortedDays[0] === today ? today : yesterday;
  for (const day of sortedDays) {
    if (day === checkDate) {
      streak++;
      const prev = new Date(new Date(checkDate).getTime() - 86400000);
      checkDate = prev.toISOString().split("T")[0];
    } else {
      break;
    }
  }
  return { currentStreak: streak, lastStudyDate: sortedDays[0] };
}

// ─── Blank form ───────────────────────────────────────────────────────────────

const blankForm = (): Omit<StudySession, "id"> => ({
  subject: "",
  topic: "",
  durationMinutes: 30,
  date: todayISO(),
  linkedProjectId: null,
  linkedTaskId: null,
  notes: "",
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudyTrackerPage() {
  const [sessions, setSessions] = useState<StudySession[]>(loadSessions);
  const [streak, setStreak] = useState<StudyStreak>(loadStreak);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blankForm());
  const [formHours, setFormHours] = useState(0);
  const [formMins, setFormMins] = useState(30);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterProject, setFilterProject] = useState("all");

  const { data: projects = [] } = useAllProjects();
  const { data: tasks = [] } = useAllTasks();

  // Sync streak to localStorage whenever sessions change
  useEffect(() => {
    saveSessions(sessions);
    const newStreak = computeStreak(sessions);
    setStreak(newStreak);
    localStorage.setItem(LS_STREAK, JSON.stringify(newStreak));
  }, [sessions]);

  // Filtered tasks by selected project
  const filteredTasks = useMemo(() => {
    if (!form.linkedProjectId) return tasks;
    return tasks.filter((t) => {
      const pid = Array.isArray(t.projectId) ? t.projectId[0] : t.projectId;
      return pid === form.linkedProjectId;
    });
  }, [tasks, form.linkedProjectId]);

  // Unique subjects
  const subjects = useMemo(
    () => Array.from(new Set(sessions.map((s) => s.subject))).filter(Boolean),
    [sessions],
  );

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = todayISO();
    const weekAgo = new Date(now.getTime() - 7 * 86400000)
      .toISOString()
      .split("T")[0];

    const todayMins = sessions
      .filter((s) => s.date === todayStr)
      .reduce((a, s) => a + s.durationMinutes, 0);
    const weekMins = sessions
      .filter((s) => s.date >= weekAgo)
      .reduce((a, s) => a + s.durationMinutes, 0);
    const allMins = sessions.reduce((a, s) => a + s.durationMinutes, 0);

    return {
      todayMins,
      weekMins,
      allMins,
      total: sessions.length,
    };
  }, [sessions]);

  // Filtered + searched sessions
  const displayed = useMemo(() => {
    return sessions
      .filter((s) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          s.subject.toLowerCase().includes(q) ||
          s.topic.toLowerCase().includes(q);
        const matchSubject =
          filterSubject === "all" || s.subject === filterSubject;
        const matchProject =
          filterProject === "all" || s.linkedProjectId === filterProject;
        return matchSearch && matchSubject && matchProject;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [sessions, search, filterSubject, filterProject]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function openNew() {
    setEditingId(null);
    setForm(blankForm());
    setFormHours(0);
    setFormMins(30);
    setDialogOpen(true);
  }

  function openEdit(session: StudySession) {
    setEditingId(session.id);
    setForm({
      subject: session.subject,
      topic: session.topic,
      durationMinutes: session.durationMinutes,
      date: session.date,
      linkedProjectId: session.linkedProjectId,
      linkedTaskId: session.linkedTaskId,
      notes: session.notes,
    });
    setFormHours(Math.floor(session.durationMinutes / 60));
    setFormMins(session.durationMinutes % 60);
    setDialogOpen(true);
  }

  function handleSave() {
    const totalMins = formHours * 60 + formMins;
    if (!form.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!form.topic.trim()) {
      toast.error("Topic is required");
      return;
    }
    if (totalMins <= 0) {
      toast.error("Duration must be greater than 0");
      return;
    }
    const updated = { ...form, durationMinutes: totalMins };
    if (editingId) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === editingId ? { ...updated, id: editingId } : s,
        ),
      );
      toast.success("Session updated");
    } else {
      const newSession: StudySession = {
        ...updated,
        id: crypto.randomUUID(),
      };
      setSessions((prev) => [newSession, ...prev]);
      toast.success("Study session logged!");
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success("Session deleted");
  }

  function getProjectName(id: string | null) {
    if (!id) return null;
    return projects.find((p) => p.id === id)?.name ?? null;
  }

  function getTaskName(id: string | null) {
    if (!id) return null;
    return tasks.find((t) => t.id === id)?.title ?? null;
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Study Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                {stats.total === 0
                  ? "No sessions yet — start tracking your study time"
                  : `${stats.total} session${stats.total !== 1 ? "s" : ""} logged`}
              </p>
            </div>
          </div>
          <Button
            onClick={openNew}
            className="gap-2"
            data-ocid="study.open_modal_button"
          >
            <Plus className="w-4 h-4" />
            Log Session
          </Button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Today",
              value: formatDuration(stats.todayMins) || "0m",
              icon: Clock,
              ocid: "study.today.card",
            },
            {
              label: "This Week",
              value: formatDuration(stats.weekMins) || "0m",
              icon: CalendarDays,
              ocid: "study.week.card",
            },
            {
              label: "All Time",
              value: formatDuration(stats.allMins) || "0m",
              icon: BookOpen,
              ocid: "study.alltime.card",
            },
            {
              label: "Sessions",
              value: String(stats.total),
              icon: GraduationCap,
              ocid: "study.sessions.card",
            },
          ].map(({ label, value, icon: Icon, ocid }) => (
            <Card key={label} data-ocid={ocid}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </span>
                  <Icon className="w-4 h-4 text-muted-foreground/60" />
                </div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Streak pill */}
        {streak.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-semibold">
              <Flame className="w-4 h-4" />
              {streak.currentStreak} day study streak
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search subject or topic…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="study.search_input"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-40" data-ocid="study.subject.select">
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="w-40" data-ocid="study.project.select">
                <SelectValue placeholder="All projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Session list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayed.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-4 text-center"
                data-ocid="study.empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {search ||
                    filterSubject !== "all" ||
                    filterProject !== "all"
                      ? "No sessions match your filters"
                      : "No study sessions yet"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {search ||
                    filterSubject !== "all" ||
                    filterProject !== "all"
                      ? "Try adjusting the search or filters"
                      : 'Click "Log Session" to track your first study block'}
                  </p>
                </div>
                {!search &&
                  filterSubject === "all" &&
                  filterProject === "all" && (
                    <Button
                      variant="outline"
                      onClick={openNew}
                      className="gap-2 mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      Log your first session
                    </Button>
                  )}
              </motion.div>
            ) : (
              displayed.map((session, i) => (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18, delay: i * 0.03 }}
                  data-ocid={`study.item.${i + 1}`}
                >
                  <Card className="group hover:border-primary/40 transition-colors">
                    <CardContent className="py-4 px-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={`text-xs font-semibold ${subjectColor(session.subject)}`}
                            >
                              {session.subject}
                            </Badge>
                            <span className="font-semibold text-foreground truncate">
                              {session.topic}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(session.durationMinutes)}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {session.date}
                            </span>
                            {getProjectName(session.linkedProjectId) && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" />
                                {getProjectName(session.linkedProjectId)}
                              </span>
                            )}
                            {getTaskName(session.linkedTaskId) && (
                              <span className="text-primary/70">
                                → {getTaskName(session.linkedTaskId)}
                              </span>
                            )}
                          </div>
                          {session.notes && (
                            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                              {session.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(session)}
                            data-ocid={`study.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(session.id)}
                            data-ocid={`study.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Log / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="study.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Study Session" : "Log Study Session"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Subject */}
            <div className="space-y-1.5">
              <Label htmlFor="study-subject">Subject *</Label>
              <Input
                id="study-subject"
                list="subjects-list"
                placeholder="e.g. Math, Programming, History"
                value={form.subject}
                onChange={(e) =>
                  setForm((p) => ({ ...p, subject: e.target.value }))
                }
                data-ocid="study.subject.input"
              />
              <datalist id="subjects-list">
                {subjects.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            {/* Topic */}
            <div className="space-y-1.5">
              <Label htmlFor="study-topic">Topic *</Label>
              <Input
                id="study-topic"
                placeholder="e.g. Quadratic Equations, React Hooks"
                value={form.topic}
                onChange={(e) =>
                  setForm((p) => ({ ...p, topic: e.target.value }))
                }
                data-ocid="study.topic.input"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <Label>Duration *</Label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={formHours}
                    onChange={(e) =>
                      setFormHours(
                        Math.max(0, Number.parseInt(e.target.value) || 0),
                      )
                    }
                    className="w-20"
                    data-ocid="study.hours.input"
                  />
                  <span className="text-sm text-muted-foreground">hrs</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={formMins}
                    onChange={(e) =>
                      setFormMins(
                        Math.min(
                          59,
                          Math.max(0, Number.parseInt(e.target.value) || 0),
                        ),
                      )
                    }
                    className="w-20"
                    data-ocid="study.minutes.input"
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="study-date">Date</Label>
              <Input
                id="study-date"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                data-ocid="study.date.input"
              />
            </div>

            {/* Link to Project */}
            <div className="space-y-1.5">
              <Label>Link to Project (optional)</Label>
              <Select
                value={form.linkedProjectId ?? "none"}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    linkedProjectId: v === "none" ? null : v,
                    linkedTaskId: null,
                  }))
                }
              >
                <SelectTrigger data-ocid="study.link_project.select">
                  <SelectValue placeholder="No project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Link to Task */}
            <div className="space-y-1.5">
              <Label>Link to Task (optional)</Label>
              <Select
                value={form.linkedTaskId ?? "none"}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    linkedTaskId: v === "none" ? null : v,
                  }))
                }
              >
                <SelectTrigger data-ocid="study.link_task.select">
                  <SelectValue placeholder="No task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No task</SelectItem>
                  {filteredTasks.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="study-notes">Notes</Label>
              <Textarea
                id="study-notes"
                placeholder="What did you study? Any key takeaways?"
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                data-ocid="study.notes.textarea"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="study.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} data-ocid="study.submit_button">
              {editingId ? "Save Changes" : "Log Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

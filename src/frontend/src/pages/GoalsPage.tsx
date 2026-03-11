import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  CheckCircle2,
  FlagTriangleRight,
  Loader2,
  Pause,
  Pencil,
  Plus,
  Target,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Goal,
  GoalCategory,
  GoalStatus,
  useAllGoals,
  useCreateGoal,
  useDeleteGoal,
  useUpdateGoal,
} from "../hooks/useQueries";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<GoalCategory, string> = {
  [GoalCategory.personal]: "Personal",
  [GoalCategory.work]: "Work",
  [GoalCategory.health]: "Health",
  [GoalCategory.learning]: "Learning",
  [GoalCategory.other]: "Other",
};

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  [GoalCategory.personal]:
    "bg-violet-500/15 text-violet-400 border-violet-500/20",
  [GoalCategory.work]: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  [GoalCategory.health]:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  [GoalCategory.learning]: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  [GoalCategory.other]: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<GoalStatus, string> = {
  [GoalStatus.active]: "Active",
  [GoalStatus.completed]: "Completed",
  [GoalStatus.paused]: "Paused",
};

const STATUS_COLORS: Record<GoalStatus, string> = {
  [GoalStatus.active]: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  [GoalStatus.completed]:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  [GoalStatus.paused]: "bg-muted text-muted-foreground",
};

const PROGRESS_BAR_COLORS: Record<GoalStatus, string> = {
  [GoalStatus.active]: "bg-amber-400",
  [GoalStatus.completed]: "bg-emerald-400",
  [GoalStatus.paused]: "bg-muted-foreground",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

// ─── Goal Form ────────────────────────────────────────────────────────────────

interface GoalFormData {
  title: string;
  description: string;
  category: GoalCategory;
  targetDate: string;
  notes: string;
  status?: GoalStatus;
  progress?: number;
}

function GoalForm({
  initialData,
  isEdit,
  onSubmit,
  isPending,
  onCancel,
}: {
  initialData?: Goal;
  isEdit: boolean;
  onSubmit: (data: GoalFormData) => void;
  isPending: boolean;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [category, setCategory] = useState<GoalCategory>(
    initialData?.category ?? GoalCategory.personal,
  );
  const [targetDate, setTargetDate] = useState(initialData?.targetDate ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [status, setStatus] = useState<GoalStatus>(
    initialData?.status ?? GoalStatus.active,
  );
  const [progress, setProgress] = useState(Number(initialData?.progress ?? 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description,
      category,
      targetDate,
      notes,
      status,
      progress,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="goal-title">Title *</Label>
        <Input
          id="goal-title"
          placeholder="e.g. Run a half marathon"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
          data-ocid="goals.input"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="goal-desc">Description</Label>
        <Textarea
          id="goal-desc"
          placeholder="What does achieving this goal look like?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          data-ocid="goals.textarea"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as GoalCategory)}
          >
            <SelectTrigger data-ocid="goals.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(GoalCategory).map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="goal-date">Target Date</Label>
          <Input
            id="goal-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </div>

      {isEdit && (
        <>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as GoalStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GoalStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Progress</Label>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {progress}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[progress]}
              onValueChange={([v]) => setProgress(v)}
              className="w-full"
            />
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="goal-notes">Notes</Label>
        <Textarea
          id="goal-notes"
          placeholder="Additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          data-ocid="goals.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || !title.trim()}
          data-ocid="goals.submit_button"
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit ? "Update" : "Create"} Goal
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({
  goal,
  index,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  index: number;
  onEdit: (g: Goal) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      data-ocid={`goals.item.${index + 1}`}
    >
      <Card className="group border-border bg-card card-hover overflow-hidden h-full">
        <CardContent className="p-5 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-1 mb-1.5">
                {goal.title}
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs border",
                    CATEGORY_COLORS[goal.category],
                  )}
                >
                  {CATEGORY_LABELS[goal.category]}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("text-xs border", STATUS_COLORS[goal.status])}
                >
                  {goal.status === GoalStatus.active && (
                    <Zap className="w-2.5 h-2.5 mr-1" />
                  )}
                  {goal.status === GoalStatus.completed && (
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                  )}
                  {goal.status === GoalStatus.paused && (
                    <Pause className="w-2.5 h-2.5 mr-1" />
                  )}
                  {STATUS_LABELS[goal.status]}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(goal)}
                data-ocid={`goals.edit_button.${index + 1}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(goal.id)}
                data-ocid={`goals.delete_button.${index + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {goal.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
              {goal.description}
            </p>
          )}

          {/* Progress */}
          <div className="mt-auto space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-semibold text-foreground tabular-nums">
                {Number(goal.progress)}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Number(goal.progress)}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  PROGRESS_BAR_COLORS[goal.status],
                )}
              />
            </div>
          </div>

          {/* Target date */}
          {goal.targetDate && (
            <div className="flex items-center gap-1.5 mt-3">
              <CalendarClock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                {formatDate(goal.targetDate)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Timeline View ────────────────────────────────────────────────────────────

type TimelinePeriod = 1 | 3 | 6 | 12;

const PERIOD_OPTIONS: { value: TimelinePeriod; label: string; ocid: string }[] =
  [
    { value: 1, label: "1 Month", ocid: "goals.period_1mo.button" },
    { value: 3, label: "3 Months", ocid: "goals.period_3mo.button" },
    { value: 6, label: "6 Months", ocid: "goals.period_6mo.button" },
    { value: 12, label: "1 Year", ocid: "goals.period_1yr.button" },
  ];

function periodLabel(period: TimelinePeriod): string {
  if (period === 1) return "1 month";
  if (period === 12) return "1 year";
  return `${period} months`;
}

function TimelineView({ goals }: { goals: Goal[] }) {
  const [period, setPeriod] = useState<TimelinePeriod>(3);

  const { grouped, noDate } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const cutoff = addMonths(now, period);

    // Goals with dates within period
    const inPeriod = goals.filter((g) => {
      if (!g.targetDate) return false;
      const d = new Date(`${g.targetDate}T00:00:00`);
      return d >= now && d <= cutoff;
    });

    // Group by month
    const monthMap = new Map<string, { label: string; goals: Goal[] }>();
    for (const g of inPeriod) {
      const d = new Date(`${g.targetDate!}T00:00:00`);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!monthMap.has(key)) monthMap.set(key, { label, goals: [] });
      monthMap.get(key)!.goals.push(g);
    }

    // Sort months
    const sortedKeys = Array.from(monthMap.keys()).sort();
    const grouped = sortedKeys.map((k) => monthMap.get(k)!);

    // Goals without dates
    const noDate = goals.filter((g) => !g.targetDate);

    return { grouped, noDate };
  }, [goals, period]);

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show next:</span>
        <div className="flex gap-1.5">
          {PERIOD_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={period === opt.value ? "default" : "outline"}
              onClick={() => setPeriod(opt.value)}
              data-ocid={opt.ocid}
              className="h-8 text-xs"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {grouped.length === 0 && noDate.length === 0 ? (
        <div
          className="border border-dashed border-border rounded-xl p-12 text-center"
          data-ocid="goals.empty_state"
        >
          <CalendarClock className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">
            No goals in this period
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Goals with target dates in the next {periodLabel(period)} will
            appear here.
          </p>
        </div>
      ) : (
        <>
          {grouped.map(({ label, goals: monthGoals }) => (
            <section
              key={label}
              data-ocid="goals.timeline_month.section"
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-display font-semibold text-sm text-foreground">
                  {label}
                </h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  {monthGoals.length} goal{monthGoals.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {monthGoals.map((g, i) => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    index={i}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            </section>
          ))}

          {noDate.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-semibold text-sm text-muted-foreground">
                  No Target Date
                </h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  {noDate.length} goal{noDate.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {noDate.map((g, i) => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    index={i}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: goals = [], isLoading } = useAllGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [addOpen, setAddOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<GoalStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<GoalCategory | "all">(
    "all",
  );

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (statusFilter !== "all" && g.status !== statusFilter) return false;
      if (categoryFilter !== "all" && g.category !== categoryFilter)
        return false;
      return true;
    });
  }, [goals, statusFilter, categoryFilter]);

  const handleCreate = async (data: GoalFormData) => {
    try {
      await createGoal.mutateAsync({
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        category: data.category,
        targetDate: data.targetDate || null,
        notes: data.notes,
      });
      setAddOpen(false);
      toast.success("Goal created");
    } catch {
      toast.error("Failed to create goal");
    }
  };

  const handleUpdate = async (data: GoalFormData) => {
    if (!editGoal) return;
    try {
      await updateGoal.mutateAsync({
        id: editGoal.id,
        title: data.title,
        description: data.description,
        category: data.category,
        targetDate: data.targetDate || null,
        status: data.status ?? editGoal.status,
        progress: data.progress ?? Number(editGoal.progress),
        notes: data.notes,
      });
      setEditGoal(null);
      toast.success("Goal updated");
    } catch {
      toast.error("Failed to update goal");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal.mutateAsync(id);
      setDeleteConfirm(null);
      toast.success("Goal deleted");
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Goals & Objectives
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Sign in to set goals, track your progress, and view your timeline.
          </p>
          <p className="text-xs text-muted-foreground">
            Use the Sign in button in the sidebar to get started.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Goals & Objectives
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {goals.length} goal{goals.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-ocid="goals.add_button">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </motion.div>

      {/* Tabs: All Goals / Timeline */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4" data-ocid="goals.tab">
          <TabsTrigger value="all">
            <FlagTriangleRight className="w-3.5 h-3.5 mr-1.5" />
            All Goals
          </TabsTrigger>
          <TabsTrigger value="timeline" data-ocid="goals.timeline.tab">
            <CalendarClock className="w-3.5 h-3.5 mr-1.5" />
            Timeline
          </TabsTrigger>
        </TabsList>

        {/* All Goals Tab */}
        <TabsContent value="all" className="space-y-5">
          {/* Status filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {(
              [
                "all",
                GoalStatus.active,
                GoalStatus.completed,
                GoalStatus.paused,
              ] as const
            ).map((s) => (
              <button
                key={s}
                type="button"
                data-ocid="goals.status_filter.tab"
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                  statusFilter === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
                )}
              >
                {s === "all" ? "All" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["all", ...Object.values(GoalCategory)] as const).map((c) => (
              <button
                key={c}
                type="button"
                data-ocid="goals.category_filter.tab"
                onClick={() => setCategoryFilter(c)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                  categoryFilter === c
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                {c === "all" ? "All Categories" : CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>

          {/* Goals grid */}
          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-ocid="goals.loading_state"
            >
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredGoals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-dashed border-border rounded-xl p-14 text-center"
              data-ocid="goals.empty_state"
            >
              <Target className="w-10 h-10 text-primary mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                {goals.length === 0
                  ? "No goals yet"
                  : "No goals match the filter"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {goals.length === 0
                  ? "Create your first goal to start tracking your objectives."
                  : "Try adjusting the status or category filter."}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredGoals.map((goal, i) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    index={i}
                    onEdit={setEditGoal}
                    onDelete={(id) => setDeleteConfirm(id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <TimelineView goals={goals} />
        </TabsContent>
      </Tabs>

      {/* Add Goal Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="goals.modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">New Goal</DialogTitle>
          </DialogHeader>
          <GoalForm
            isEdit={false}
            onSubmit={handleCreate}
            isPending={createGoal.isPending}
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={!!editGoal} onOpenChange={(o) => !o && setEditGoal(null)}>
        <DialogContent data-ocid="goals.modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Goal</DialogTitle>
          </DialogHeader>
          {editGoal && (
            <GoalForm
              initialData={editGoal}
              isEdit={true}
              onSubmit={handleUpdate}
              isPending={updateGoal.isPending}
              onCancel={() => setEditGoal(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <AlertDialogContent data-ocid="goals.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the goal and all its progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="goals.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90"
              data-ocid="goals.confirm_button"
            >
              {deleteGoal.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Flame,
  Pencil,
  Plus,
  Repeat2,
  Trash2,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Habit, useHabits } from "../hooks/useHabits";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const PRESET_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

// ─── Habit Form ───────────────────────────────────────────────────────────────

interface HabitFormData {
  name: string;
  description: string;
  color: string;
  frequency: "daily" | "weekly";
}

function HabitForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: {
  initialData?: HabitFormData;
  onSubmit: (data: HabitFormData) => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [color, setColor] = useState(initialData?.color ?? PRESET_COLORS[0]);
  const [frequency, setFrequency] = useState<"daily" | "weekly">(
    initialData?.frequency ?? "daily",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description, color, frequency });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="habit-name">Name *</Label>
        <Input
          id="habit-name"
          placeholder="e.g. Morning meditation"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          data-ocid="habit.name.input"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="habit-desc">Description</Label>
        <Textarea
          id="habit-desc"
          placeholder="Why is this habit important?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          data-ocid="habit.description.textarea"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Color</Label>
        <div className="flex gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                color === c &&
                  "ring-2 ring-offset-2 ring-offset-background scale-110",
              )}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Frequency</Label>
        <Select
          value={frequency}
          onValueChange={(v) => setFrequency(v as "daily" | "weekly")}
        >
          <SelectTrigger data-ocid="habit.frequency.select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          data-ocid="habit.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending || !name.trim()}
          data-ocid="habit.submit_button"
        >
          {initialData ? "Save Changes" : "Add Habit"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Habit Card ───────────────────────────────────────────────────────────────

function HabitCard({
  habit,
  index,
  completed,
  currentStreak,
  longestStreak,
  onToggle,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  index: number;
  completed: boolean;
  currentStreak: number;
  longestStreak: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      data-ocid={`habits.item.${index + 1}`}
    >
      <Card
        className={cn(
          "group border-border bg-card card-hover overflow-hidden relative transition-all duration-300",
          completed && "ring-1 ring-inset",
        )}
      >
        {/* Colored left accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: habit.color }}
        />
        {completed && (
          <div
            className="absolute inset-0 opacity-[0.03] rounded-xl"
            style={{ backgroundColor: habit.color }}
          />
        )}
        <CardContent className="pl-5 pr-4 py-4">
          <div className="flex items-start gap-3">
            {/* Toggle check button */}
            <button
              type="button"
              onClick={onToggle}
              data-ocid={`habit.toggle.${index + 1}`}
              className={cn(
                "mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border-2",
                completed
                  ? "border-transparent text-white"
                  : "border-border hover:border-current",
              )}
              style={
                completed
                  ? { backgroundColor: habit.color }
                  : { color: habit.color }
              }
              aria-label={completed ? "Mark incomplete" : "Mark complete"}
            >
              {completed && <CheckCircle2 className="w-4 h-4" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3
                    className={cn(
                      "font-display font-semibold text-sm leading-snug",
                      completed
                        ? "text-muted-foreground line-through"
                        : "text-foreground",
                    )}
                  >
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {habit.description}
                    </p>
                  )}
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={onEdit}
                    data-ocid={`habit.edit_button.${index + 1}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={onDelete}
                    data-ocid={`habit.delete_button.${index + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 mt-2.5">
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground capitalize"
                >
                  {habit.frequency}
                </Badge>
                <div className="flex items-center gap-1 text-xs">
                  <Flame
                    className="w-3.5 h-3.5"
                    style={{ color: currentStreak > 0 ? "#f59e0b" : undefined }}
                  />
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      currentStreak > 0
                        ? "text-amber-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {currentStreak}
                  </span>
                  <span className="text-muted-foreground">streak</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Trophy className="w-3 h-3" />
                  <span className="tabular-nums">{longestStreak} best</span>
                </div>
              </div>

              {/* Milestone badges */}
              {currentStreak >= 7 && (
                <div className="mt-2">
                  <Badge
                    className={cn(
                      "text-xs font-bold",
                      currentStreak >= 30
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : currentStreak >= 14
                          ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                    )}
                    variant="outline"
                  >
                    🔥{" "}
                    {currentStreak >= 30
                      ? "30-day streak!"
                      : currentStreak >= 14
                        ? "14-day streak!"
                        : "7-day streak!"}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HabitsPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isCompletedToday,
    getCurrentStreak,
    getLongestStreak,
    getTodayCompletionCount,
  } = useHabits();

  const [addOpen, setAddOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { completed: todayCompleted, total: todayTotal } =
    getTodayCompletionCount();
  const progressPct = todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0;

  const handleAdd = (data: HabitFormData) => {
    addHabit(data);
    setAddOpen(false);
    toast.success("Habit added!");
  };

  const handleEdit = (data: HabitFormData) => {
    if (!editHabit) return;
    updateHabit(editHabit.id, data);
    setEditHabit(null);
    toast.success("Habit updated");
  };

  const handleDelete = (id: string) => {
    deleteHabit(id);
    setDeleteConfirm(null);
    toast.success("Habit deleted");
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
            <Repeat2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Habits Tracker
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Sign in to build daily habits, track streaks, and stay consistent.
          </p>
          <p className="text-xs text-muted-foreground">
            Use the Sign in button in the sidebar to get started.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Habits
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {habits.length} habit{habits.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-ocid="habit.add_button">
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </motion.div>

      {/* Today's progress */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Repeat2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Today's Progress
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {todayCompleted}{" "}
                  <span className="text-muted-foreground font-normal">
                    / {todayTotal}
                  </span>
                </span>
              </div>
              <Progress value={progressPct} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {todayCompleted === todayTotal && todayTotal > 0
                  ? "🎉 All habits completed today!"
                  : `${todayTotal - todayCompleted} habit${todayTotal - todayCompleted !== 1 ? "s" : ""} left to complete`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Habits grid */}
      {habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-dashed border-border rounded-xl p-16 text-center"
          data-ocid="habits.empty_state"
        >
          <Repeat2 className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No habits yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Start building consistent daily routines. Add your first habit.
          </p>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            data-ocid="habit.add_button"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add your first habit
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {habits.map((habit, i) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                index={i}
                completed={isCompletedToday(habit.id)}
                currentStreak={getCurrentStreak(habit.id)}
                longestStreak={getLongestStreak(habit.id)}
                onToggle={() => toggleCompletion(habit.id)}
                onEdit={() => setEditHabit(habit)}
                onDelete={() => setDeleteConfirm(habit.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="habit.dialog" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">New Habit</DialogTitle>
          </DialogHeader>
          <HabitForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editHabit} onOpenChange={(o) => !o && setEditHabit(null)}>
        <DialogContent data-ocid="habit.dialog" className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Habit</DialogTitle>
          </DialogHeader>
          {editHabit && (
            <HabitForm
              initialData={editHabit}
              onSubmit={handleEdit}
              onCancel={() => setEditHabit(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <AlertDialogContent data-ocid="habit.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the habit and all completion history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="habit.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90"
              data-ocid="habit.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

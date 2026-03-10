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
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Edit2,
  Loader2,
  LogIn,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type JournalEntry,
  JournalMood,
  useAllJournalEntries,
  useCreateJournalEntry,
  useDeleteJournalEntry,
  useUpdateJournalEntry,
} from "../hooks/useQueries";

const MOOD_CONFIG: Record<
  JournalMood,
  { emoji: string; label: string; color: string }
> = {
  [JournalMood.happy]: {
    emoji: "😊",
    label: "Happy",
    color: "text-yellow-400",
  },
  [JournalMood.neutral]: {
    emoji: "😐",
    label: "Neutral",
    color: "text-blue-400",
  },
  [JournalMood.sad]: { emoji: "😢", label: "Sad", color: "text-indigo-400" },
  [JournalMood.stressed]: {
    emoji: "😰",
    label: "Stressed",
    color: "text-red-400",
  },
  [JournalMood.energized]: {
    emoji: "⚡",
    label: "Energized",
    color: "text-green-400",
  },
};

const todayStr = () => new Date().toISOString().split("T")[0];

interface FormState {
  title: string;
  date: string;
  mood: JournalMood;
  content: string;
  tags: string;
}

const emptyForm = (): FormState => ({
  title: "",
  date: todayStr(),
  mood: JournalMood.neutral,
  content: "",
  tags: "",
});

export default function JournalPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: entries = [], isLoading } = useAllJournalEntries();
  const createEntry = useCreateJournalEntry();
  const updateEntry = useUpdateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState<JournalMood | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = entries
    .filter((e) => {
      const q = search.toLowerCase();
      if (
        q &&
        !e.title.toLowerCase().includes(q) &&
        !e.content.toLowerCase().includes(q)
      )
        return false;
      if (moodFilter !== "all" && e.mood !== moodFilter) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  function openCreate() {
    setEditingEntry(null);
    setForm(emptyForm());
    setDialogOpen(true);
  }

  function openEdit(entry: JournalEntry) {
    setEditingEntry(entry);
    setForm({
      title: entry.title,
      date: entry.date,
      mood: entry.mood,
      content: entry.content,
      tags: entry.tags.join(", "),
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const now = new Date().toISOString();

    if (editingEntry) {
      await updateEntry.mutateAsync({
        id: editingEntry.id,
        title: form.title.trim(),
        content: form.content.trim(),
        mood: form.mood,
        tags,
        date: form.date,
        createdAt: editingEntry.createdAt,
      });
      toast.success("Entry updated");
    } else {
      await createEntry.mutateAsync({
        id: crypto.randomUUID(),
        title: form.title.trim(),
        content: form.content.trim(),
        mood: form.mood,
        tags,
        date: form.date,
        createdAt: now,
      });
      toast.success("Entry saved");
    }
    setDialogOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteEntry.mutateAsync(id);
    setDeleteConfirmId(null);
    toast.success("Entry deleted");
  }

  if (!isAuthenticated) {
    return (
      <div
        data-ocid="journal.page"
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Your Private Journal
          </h2>
          <p className="text-muted-foreground text-sm">
            Sign in to start writing private journal entries, track your moods,
            and reflect on your journey.
          </p>
        </div>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="auth.login_button"
          size="lg"
        >
          <LogIn className="w-4 h-4 mr-2" />
          {isLoggingIn ? "Signing in..." : "Sign in to continue"}
        </Button>
      </div>
    );
  }

  return (
    <div data-ocid="journal.page" className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Journal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <Button
          onClick={openCreate}
          data-ocid="journal.new_entry.button"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="journal.search.input"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={moodFilter}
          onValueChange={(v) => setMoodFilter(v as JournalMood | "all")}
        >
          <SelectTrigger
            data-ocid="journal.mood_filter.select"
            className="w-[160px]"
          >
            <SelectValue placeholder="Filter by mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All moods</SelectItem>
            {Object.entries(MOOD_CONFIG).map(([mood, { emoji, label }]) => (
              <SelectItem key={mood} value={mood}>
                {emoji} {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div
          data-ocid="journal.empty_state"
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {search || moodFilter !== "all"
                ? "No entries match your filters"
                : "No journal entries yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {search || moodFilter !== "all"
                ? "Try adjusting your search or filter"
                : "Start writing your first entry"}
            </p>
          </div>
          {!search && moodFilter === "all" && (
            <Button onClick={openCreate} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Write first entry
            </Button>
          )}
        </div>
      )}

      {/* Entries list */}
      <AnimatePresence>
        <div className="space-y-4">
          {filtered.map((entry, index) => {
            const mood =
              MOOD_CONFIG[entry.mood] ?? MOOD_CONFIG[JournalMood.neutral];
            const itemIndex = index + 1;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.04 }}
                data-ocid={`journal.entry.item.${itemIndex}`}
              >
                <Card className="card-hover border-border/60 bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xl">{mood.emoji}</span>
                          <h3 className="font-display font-semibold text-foreground text-lg leading-tight">
                            {entry.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs ml-auto sm:ml-0",
                              mood.color,
                            )}
                          >
                            {mood.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                          {entry.content.length > 150
                            ? `${entry.content.slice(0, 150)}…`
                            : entry.content}
                        </p>
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {entry.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-0"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(entry)}
                          data-ocid={`journal.entry.edit_button.${itemIndex}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteConfirmId(entry.id)}
                          data-ocid={`journal.entry.delete_button.${itemIndex}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="journal.entry_form.dialog"
          className="max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingEntry ? "Edit Entry" : "New Journal Entry"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="entry-title">Title</Label>
              <Input
                id="entry-title"
                data-ocid="journal.title.input"
                placeholder="What's on your mind?"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="entry-date">Date</Label>
                <Input
                  id="entry-date"
                  data-ocid="journal.date.input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Mood</Label>
                <Select
                  value={form.mood}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, mood: v as JournalMood }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MOOD_CONFIG).map(
                      ([mood, { emoji, label }]) => (
                        <SelectItem key={mood} value={mood}>
                          {emoji} {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="entry-content">Write your thoughts</Label>
              <Textarea
                id="entry-content"
                data-ocid="journal.content.textarea"
                placeholder="How was your day? What are you feeling? What did you accomplish?"
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                rows={7}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="entry-tags">Tags (comma-separated)</Label>
              <Input
                id="entry-tags"
                data-ocid="journal.tags.input"
                placeholder="productivity, gratitude, work..."
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="journal.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createEntry.isPending || updateEntry.isPending}
              data-ocid="journal.save.button"
            >
              {createEntry.isPending || updateEntry.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingEntry ? (
                "Update Entry"
              ) : (
                "Save Entry"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this journal entry? This action
            cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              data-ocid="journal.cancel.button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteEntry.isPending}
              data-ocid="journal.entry.delete_button.1"
            >
              {deleteEntry.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Brain,
  CheckCircle2,
  Clock,
  Coffee,
  History,
  Pause,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusSessions } from "../hooks/useFocusSessions";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllProjects, useAllTasks } from "../hooks/useQueries";

type TimerMode = "work" | "break";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// SVG circular progress ring
function TimerRing({
  progress,
  isBreak,
  children,
}: {
  progress: number; // 0–1
  isBreak: boolean;
  children: React.ReactNode;
}) {
  const size = 260;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const color = isBreak ? "oklch(0.65 0.18 220)" : "oklch(0.72 0.19 156)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        style={{ filter: `drop-shadow(0 0 12px ${color}55)` }}
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.22 0.008 265)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function FocusPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: tasks = [] } = useAllTasks();
  const { data: projects = [] } = useAllProjects();
  const { sessions, saveSession, clearSessions } = useFocusSessions();

  const [mode, setMode] = useState<TimerMode>("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [linkedTaskId, setLinkedTaskId] = useState<string>("none");
  const [showHistory, setShowHistory] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<string | null>(null);

  const totalSeconds = mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
  const progress = secondsLeft / totalSeconds;

  const activeTasks = tasks.filter((t) => !t.completed);
  const linkedTask =
    linkedTaskId !== "none" ? tasks.find((t) => t.id === linkedTaskId) : null;

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleSessionComplete = useCallback(() => {
    const completedAt = new Date().toISOString();
    const startedAt =
      startedAtRef.current ??
      new Date(Date.now() - WORK_SECONDS * 1000).toISOString();
    const project = linkedTask?.projectId
      ? projects.find((p) => p.id === linkedTask.projectId)
      : null;
    saveSession({
      startedAt,
      completedAt,
      durationSeconds: WORK_SECONDS,
      taskId: linkedTask?.id ?? null,
      taskTitle: linkedTask?.title ?? null,
      projectId: project?.id ?? null,
      projectName: project?.name ?? null,
    });
    startedAtRef.current = null;
  }, [linkedTask, projects, saveSession]);

  useEffect(() => {
    if (isRunning) {
      if (!startedAtRef.current) {
        startedAtRef.current = new Date().toISOString();
      }
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            stopTimer();
            setIsRunning(false);
            if (mode === "work") {
              setSessionCount((s) => s + 1);
              handleSessionComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [isRunning, stopTimer, mode, handleSessionComplete]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    startedAtRef.current = null;
    setSecondsLeft(mode === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    startedAtRef.current = null;
    setMode(newMode);
    setSecondsLeft(newMode === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };

  const isBreak = mode === "break";

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Focus Timer
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Pomodoro technique for deep focus
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory((v) => !v)}
          className="gap-2"
          data-ocid="focus.history.toggle"
        >
          <History className="w-3.5 h-3.5" />
          History
          {sessions.length > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {sessions.length}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Mode toggle */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2"
      >
        <Button
          variant={!isBreak ? "default" : "outline"}
          size="sm"
          onClick={() => switchMode("work")}
          className="gap-2"
          data-ocid="focus.work_mode.toggle"
        >
          <Brain className="w-3.5 h-3.5" />
          Focus
        </Button>
        <Button
          variant={isBreak ? "default" : "outline"}
          size="sm"
          onClick={() => switchMode("break")}
          className="gap-2"
          data-ocid="focus.break_mode.toggle"
          style={
            isBreak
              ? { backgroundColor: "oklch(0.65 0.18 220)", color: "white" }
              : {}
          }
        >
          <Coffee className="w-3.5 h-3.5" />
          Break
        </Button>
      </motion.div>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center"
      >
        <div
          className={cn(
            "timer-glow rounded-full p-1",
            isBreak && "timer-break-glow",
          )}
        >
          <TimerRing progress={progress} isBreak={isBreak}>
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={secondsLeft}
                  initial={{ opacity: 0.7, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-display text-5xl font-bold text-foreground tabular-nums"
                >
                  {formatTime(secondsLeft)}
                </motion.div>
              </AnimatePresence>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                {isBreak ? "Break" : "Focus"}
              </p>
            </div>
          </TimerRing>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full"
            onClick={handleReset}
            data-ocid="focus.reset_button"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          {isRunning ? (
            <Button
              size="lg"
              className="h-14 w-14 rounded-full p-0"
              onClick={handlePause}
              data-ocid="focus.pause_button"
              style={isBreak ? { backgroundColor: "oklch(0.65 0.18 220)" } : {}}
            >
              <Pause className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-14 w-14 rounded-full p-0"
              onClick={handleStart}
              data-ocid="focus.start_button"
              style={isBreak ? { backgroundColor: "oklch(0.65 0.18 220)" } : {}}
              disabled={secondsLeft === 0}
            >
              <Play className="w-5 h-5 ml-0.5" />
            </Button>
          )}

          <div className="h-11 w-11 rounded-full border border-border flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">
              {sessionCount}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          {sessionCount === 0
            ? "Start your first session"
            : `${sessionCount} session${sessionCount !== 1 ? "s" : ""} completed today`}
        </p>
      </motion.div>

      {/* Session info card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        data-ocid="focus.session.card"
      >
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Session Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Completed sessions */}
            <div className="flex items-center gap-3 flex-wrap">
              {Array.from({ length: Math.max(sessionCount, 4) }, (_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: timer session slots are positional
                  key={i}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all",
                    i < sessionCount
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {i < sessionCount ? "✓" : i + 1}
                </div>
              ))}
              {sessionCount > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{sessionCount - 4} more
                </Badge>
              )}
            </div>

            {/* Link a task */}
            {isAuthenticated && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">
                  Working on:
                </p>
                <Select
                  value={linkedTaskId}
                  onValueChange={setLinkedTaskId}
                  data-ocid="focus.task.select"
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Link a task (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No task linked</SelectItem>
                    {activeTasks.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {linkedTask && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <p className="text-xs text-foreground font-medium truncate">
                      {linkedTask.title}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-display text-2xl font-bold text-primary">
                  25
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  min focus
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">
                  5
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  min break
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {sessionCount}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  sessions done
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Session History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            data-ocid="focus.history.panel"
          >
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Session History
                  </CardTitle>
                  {sessions.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSessions}
                      className="text-muted-foreground hover:text-destructive gap-1.5 h-7 px-2"
                      data-ocid="focus.history.delete_button"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear history
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {sessions.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-10 text-center"
                    data-ocid="focus.history.empty_state"
                  >
                    <Clock className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No sessions recorded yet.
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Complete a focus session to see it here.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-72">
                    <div className="divide-y divide-border">
                      {sessions.map((s, idx) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-3 px-5 py-3"
                          data-ocid={`focus.history.item.${idx + 1}`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                            <Brain className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {s.taskTitle ?? "No task linked"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {s.projectName ?? "—"} &middot;{" "}
                              {new Date(s.completedAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}{" "}
                              {new Date(s.completedAt).toLocaleTimeString(
                                "en-US",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs flex-shrink-0"
                          >
                            {formatDuration(s.durationSeconds)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { r as reactExports, j as jsxRuntimeExports, a as cn } from "./index-ByEywl6s.js";
import { c as createContextScope, P as Primitive } from "./index-B1OTAsPJ.js";
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
const STORAGE_KEY = "focusflow_habits";
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { habits: [], completions: {} };
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.habits)) return parsed;
    return { habits: [], completions: {} };
  } catch {
    return { habits: [], completions: {} };
  }
}
function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
function calcCurrentStreak(dates) {
  if (dates.length === 0) return 0;
  const unique = Array.from(new Set(dates)).sort().reverse();
  const today = todayStr();
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().slice(0, 10);
  if (unique[0] !== today && unique[0] !== yesterdayIso) return 0;
  let streak = 0;
  let current = new Date(unique[0]);
  const dateSet = new Set(unique);
  while (true) {
    const d = current.toISOString().slice(0, 10);
    if (dateSet.has(d)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
function calcLongestStreak(dates) {
  if (dates.length === 0) return 0;
  const unique = Array.from(new Set(dates)).sort();
  if (unique.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diff = Math.round(
      (curr.getTime() - prev.getTime()) / (1e3 * 60 * 60 * 24)
    );
    if (diff === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}
function useHabits() {
  const [store, setStore] = reactExports.useState(loadStore);
  reactExports.useEffect(() => {
    const handler = () => setStore(loadStore());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  const update = reactExports.useCallback((updater) => {
    setStore((prev) => {
      const next = updater(prev);
      saveStore(next);
      return next;
    });
  }, []);
  const addHabit = reactExports.useCallback(
    (habit) => {
      update((s) => ({
        ...s,
        habits: [
          ...s.habits,
          {
            ...habit,
            id: crypto.randomUUID(),
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        ]
      }));
    },
    [update]
  );
  const updateHabit = reactExports.useCallback(
    (id, updates) => {
      update((s) => ({
        ...s,
        habits: s.habits.map((h) => h.id === id ? { ...h, ...updates } : h)
      }));
    },
    [update]
  );
  const deleteHabit = reactExports.useCallback(
    (id) => {
      update((s) => {
        const completions = { ...s.completions };
        delete completions[id];
        return { habits: s.habits.filter((h) => h.id !== id), completions };
      });
    },
    [update]
  );
  const toggleCompletion = reactExports.useCallback(
    (habitId, date) => {
      const d = date ?? todayStr();
      update((s) => {
        const existing = s.completions[habitId] ?? [];
        const has = existing.includes(d);
        return {
          ...s,
          completions: {
            ...s.completions,
            [habitId]: has ? existing.filter((x) => x !== d) : [...existing, d]
          }
        };
      });
    },
    [update]
  );
  const isCompletedToday = reactExports.useCallback(
    (habitId) => {
      return (store.completions[habitId] ?? []).includes(todayStr());
    },
    [store]
  );
  const getCurrentStreak = reactExports.useCallback(
    (habitId) => {
      return calcCurrentStreak(store.completions[habitId] ?? []);
    },
    [store]
  );
  const getLongestStreak = reactExports.useCallback(
    (habitId) => {
      return calcLongestStreak(store.completions[habitId] ?? []);
    },
    [store]
  );
  const getTodayCompletionCount = reactExports.useCallback(() => {
    const today = todayStr();
    const completed = store.habits.filter(
      (h) => (store.completions[h.id] ?? []).includes(today)
    ).length;
    return { completed, total: store.habits.length };
  }, [store]);
  return {
    habits: store.habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isCompletedToday,
    getCurrentStreak,
    getLongestStreak,
    getTodayCompletionCount
  };
}
export {
  Progress as P,
  useHabits as u
};

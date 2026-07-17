"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  STORAGE_KEY,
  createInitialState,
  gameReducer,
  parseState,
  serializeState,
  type RunState,
} from "@/lib/game";

export function useRun() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    let saved: RunState | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) saved = parseState(raw);
    } catch {
      /* ignore */
    }

    const id = window.setTimeout(() => {
      if (saved && saved.status !== "idle") {
        dispatch({ type: "HYDRATE", state: saved });
      }
      setHydrated(true);
      skipSave.current = false;
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated || skipSave.current) return;
    try {
      if (state.status === "idle") {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, serializeState(state));
      }
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  return { state, dispatch, hydrated };
}

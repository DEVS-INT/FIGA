"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

const STORAGE_KEY = "figa:sessionTimeoutMs";
const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function getTimeoutMsFromStorage() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return DEFAULT_TIMEOUT_MS;
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_TIMEOUT_MS;
  } catch (e) {
    return DEFAULT_TIMEOUT_MS;
  }
}

export default function SessionTimeoutWatcher() {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    function clearTimer() {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    }

    function resetTimer() {
      clearTimer();
      const timeout = getTimeoutMsFromStorage();
      // setTimeout returns a number in browser
      timer.current = window.setTimeout(() => {
        // Only sign out if component still mounted
        if (mounted) {
          // redirect to signin page after signOut
          signOut({ callbackUrl: "/signin" });
        }
      }, timeout);
    }

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    // Activity resets timer
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    // Page visibility also resets when user returns
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) resetTimer();
    });

    // Initialize
    resetTimer();

    // Also observe storage changes (so settings changes in another tab apply)
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) resetTimer();
    }
    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      clearTimer();
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      document.removeEventListener("visibilitychange", () => {});
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}

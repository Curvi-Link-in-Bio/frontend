import { useState, useEffect } from "react";

export function useDebounce<T = any>(delay = 500, callback: () => T) {
  useEffect(() => {
    const timer = setTimeout(() => callback(), delay);
    return () => clearTimeout(timer);
  }, [callback, delay]);
}
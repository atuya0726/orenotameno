// Each entry is independent so one damaged value cannot hide other drafts.
export function createSessionStore<T>(prefix: string, parse: (value: unknown) => T) {
  return {
    load(): T[] {
      const values: T[] = [];
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (!key?.startsWith(prefix)) continue;
          try { values.push(parse(JSON.parse(sessionStorage.getItem(key) ?? 'null'))); }
          catch { /* Ignore an invalid entry. */ }
        }
      } catch { /* Saving reports unavailable storage when the learner edits. */ }
      return values;
    },
    save(id: string, value: T): void {
      sessionStorage.setItem(prefix + id, JSON.stringify(parse(value)));
    },
    remove(id: string): void { sessionStorage.removeItem(prefix + id); },
  };
}

export function removeLocalStorageByPrefix(prefix: string): void {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) localStorage.removeItem(key);
    }
  } catch { /* Old calculator data is optional when browser storage is blocked. */ }
}

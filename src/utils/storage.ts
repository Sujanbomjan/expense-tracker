export const save = async <T>(key: string, value: T): Promise<void> => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage save error:", e);
  }
};

export const load = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    console.error("Storage load error:", e);
    return fallback;
  }
};

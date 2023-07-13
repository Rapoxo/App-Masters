import React, { useState, useEffect } from "react";

export default function useSessionStorage<T>(
  key: string,
  initialValue?: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const item =
      typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

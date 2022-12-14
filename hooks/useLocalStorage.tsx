import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  // we use a function because we want to render it only once and not everytime
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);

    // if there's value in the local storage, parse
    if (jsonValue != null) return JSON.parse(jsonValue);

    // if there's no value in the local storage
    if (typeof initialValue === "function") {
      // mimic a function type to erase type error
      return (initialValue as () => T)();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]); // re-renders everytime key or value changes

  // fixes types error by setting the default types as [value, setValue]
  return [value, setValue] as [typeof value, typeof setValue];
}

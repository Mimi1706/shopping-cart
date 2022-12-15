import { useEffect, useState } from "react";
import { isSSR } from "../utilities/ssr";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  // we use a function because we want to render it only once and not everytime
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const jsonValue = !isSSR() == false ? null : localStorage.getItem(key);

    // if there's value in the local storage, parse
    if (jsonValue != null) {
      return setValue(JSON.parse(jsonValue));
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }, [key, value]); // re-renders everytime key or value changes

  // fixes types error by setting the default types as [value, setValue]
  return [value, setValue] as [typeof value, typeof setValue];
}

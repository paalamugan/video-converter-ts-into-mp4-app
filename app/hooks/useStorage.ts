import { useCallback, useState, useEffect } from "react";

export const PREFIX_KEY = "APP";

export function useLocalStorage<T2>(key: string, defaultValue?: T2) {
  return useStorage<string, T2, Storage | null>(
    key,
    defaultValue,
    typeof window !== "undefined" ? window.localStorage : null
  );
}

export function useSessionStorage<T2>(key: string, defaultValue?: T2) {
  return useStorage<string, T2, Storage | null>(
    key,
    defaultValue,
    typeof window !== "undefined" ? window.sessionStorage : null
  );
}

function useStorage<
  T1 extends string,
  T2 extends unknown,
  T3 extends Storage | null
>(key: T1, defaultValue?: T2, storageObject?: T3) {
  const prefixedKey = `${PREFIX_KEY}_${key}`;
  const [value, setValue] = useState<T2>(() => {
    if (!storageObject) return;
    const jsonValue = storageObject.getItem(prefixedKey);
    if (jsonValue != null) return JSON.parse(jsonValue);

    if (typeof defaultValue === "function") {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (!storageObject) return;
    if (value === undefined) return storageObject.removeItem(prefixedKey);
    storageObject.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value, storageObject]);

  const remove = useCallback(() => {
    setValue(defaultValue as T2);
    storageObject && storageObject.removeItem(prefixedKey);
  }, [storageObject, prefixedKey, defaultValue]);

  return [value, setValue, remove] as [
    T2,
    React.Dispatch<React.SetStateAction<T2>>,
    () => void
  ];
}

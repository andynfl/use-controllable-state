import { useState, useCallback } from 'react';

export interface UseControllableStateOptions<T> {
  defaultValue: T;
  value?: T;
  onChange?(value: T): void;
}

export default function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = value !== undefined;
  const state = isControlled ? value : uncontrolledValue;

  const dispatch = useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (nextValue) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
        return;
      }

      onChange?.(typeof nextValue === 'function' ? (nextValue as (v: T) => T)(value) : nextValue);
    },
    [isControlled, onChange, value],
  );

  return [state, dispatch] as const;
}

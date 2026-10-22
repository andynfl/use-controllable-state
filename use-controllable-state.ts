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

      const resolvedValue = isFunction(nextValue) ? (nextValue(value) as T) : (nextValue as T);

      if (!Object.is(resolvedValue, value)) onChange?.(resolvedValue);
    },
    [isControlled, onChange, value],
  );

  return [state, dispatch] as const;
}

function isFunction(arg: unknown): arg is (...args: unknown[]) => unknown {
  return typeof arg === 'function';
}

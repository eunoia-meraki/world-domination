import { useState, useCallback, useRef, useEffect } from 'react';

export type NewStateCallback<T> = (v: T) => T;
export type StateUpdatedCallback<T> = (v: T) => void;

function useStateWithCallback<T> (initialState: T): [T, (newState: NewStateCallback<T>, cb?: StateUpdatedCallback<T>) => void] {
  const [state, setState] = useState<T>(initialState);
  const cbRef = useRef<((state: T) => void) | undefined>(undefined);

  const updateState = useCallback((newState: NewStateCallback<T>, cb?: StateUpdatedCallback<T>) => {
    cbRef.current = cb;
    setState(prev => newState(prev));
  }, []);

  // When state was changeh invoke callback (if it was passed) with new state
  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = undefined;
    }
  }, [state]);

  return [state, updateState];
};

export default useStateWithCallback;

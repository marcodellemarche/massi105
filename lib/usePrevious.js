import { useEffect, useRef } from 'react';

/**
 * Custom hook for getting previous value 
 * @template T
 * @param {T} value 
 * @returns previous value
 */
export function usePrevious(value) {
    const ref = useRef(value);
    
    useEffect(() => {
      ref.current = value;
    });
  
    return ref.current;
}
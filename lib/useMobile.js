/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';

/**
 * Custom hook to know if we're on a mobile width
 * @returns if we're on mobile
 */
export function useMobile() {
    try { window; } catch {
        return;
    }
    
    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);

        return () => window.removeEventListener('resize', handleWindowSizeChange);
    }, []);

    return width <= 768;
}

import { useEffect, useRef } from 'react';

export function useRefLogger<T>(value: T, label: string = 'Reference changed') {
    const prevRef = useRef<T>(value);

    useEffect(() => {
        if (prevRef.current !== value) {
            console.log(`${label}:`, {
                previous: prevRef.current,
                current: value,
                changed: true
            });
            prevRef.current = value;
        }
    }, [value, label]);

    return value;
}
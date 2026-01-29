import { useState, useEffect } from 'react';

// Target: Feb 13, 23:59:00 of the current year (or next if passed)
// Based on prompt: February 13, 23:59 (11:59 PM)
// Current date is Jan 29, 2026. So Feb 13, 2026.

export const useCountdown = (targetDate: Date | number | string) => {
    const target = new Date(targetDate).getTime();

    const [timeLeft, setTimeLeft] = useState(calcTimeLeft());

    function calcTimeLeft() {
        const now = new Date();
        const difference = target - now.getTime();

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                total: 0,
                isComplete: true
            };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            total: difference,
            isComplete: false
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calcTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [target]);

    return timeLeft;
};

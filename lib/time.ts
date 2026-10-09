export const LAST_MINUTE = 23 * 60 + 59;

// Convert minutes since midnight to a 24-hour HH:mm string.
export const formatTime = (minutes: number): string =>
    `${Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;

export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

export const clampMinutes = (minutes: number, maxMinutes = LAST_MINUTE): number =>
    Math.min(maxMinutes, Math.max(0, minutes));

export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
};
